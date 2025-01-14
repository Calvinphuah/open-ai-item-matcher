import axios from "axios";
import {
  findClosestSupplierWithOpenAI,
  matchClosestItem,
} from "./controllers/openaiController.js";
import documentAIData from "../docaiData.json" assert { type: "json" };

// Define types
interface Supplier {
  id: number;
  name: string;
}

interface Item {
  id: number;
  supplier: string;
  description: string;
  price: number;
  rate: number;
}

interface CombinedItem {
  id: number;
  supplier: string;
  description: string;
  price: number;
  rate: number;
  quantity: string;
}

interface LineItem {
  "line_item/quantity": string;
  "line_item/description": string;
}

// Fetch suppliers from json-server
const fetchSuppliers = async (): Promise<string[]> => {
  try {
    const response = await axios.get("http://localhost:3000/suppliers");
    return response.data.map((supplier: Supplier) => supplier.name);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

// Fetch items for a specific supplier
const fetchSupplierItems = async (supplierName: string): Promise<Item[]> => {
  try {
    const response = await axios.get(
      `http://localhost:3000/items?supplier=${encodeURIComponent(supplierName)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items for supplier:", error);
    throw error;
  }
};

const processDocumentAIData = async () => {
  try {
    // Step 1: Fetch all supplier names for matching later
    const supplierNames = await fetchSuppliers();
    console.log("Available suppliers:", supplierNames);

    // Step 2: Find the closest supplier based on the DOC AI data
    const closestSupplier = await findClosestSupplierWithOpenAI(
      documentAIData.supplier_name,
      supplierNames
    );
    console.log(`Closest supplier: ${closestSupplier}`);

    // Step 3: Fetch items for the closest supplier
    const supplierItems = await fetchSupplierItems(closestSupplier);
    console.log(
      "Available items:",
      supplierItems.map((item) => item.description)
    );

    // Step 4: Match each line item from Document AI data and combine details
    const matchedItems = documentAIData.line_items
      .map(async (lineItem: LineItem) => {
        const description = lineItem["line_item/description"];
        console.log("Line Item Description:", description);

        const matchingItem = await matchClosestItem(description, supplierItems);
        console.log("Matched Item:", matchingItem);

        let combinedItem: CombinedItem | null = null;
        if (matchingItem) {
          combinedItem = {
            ...matchingItem,
            quantity: lineItem["line_item/quantity"],
          };
          // Log the final matched items
          console.log("Matched Item:", matchingItem);
          console.log("Combined Item:", combinedItem);

          return combinedItem;
        } else {
          console.warn(`No match found for line item: ${description}`);
          return null;
        }
      })
      .filter(Boolean); // Remove nulls for unmatched items

    return matchedItems;
  } catch (error) {
    console.error("Error processing Document AI data:", error);
    throw error;
  }
};

// Start processing
processDocumentAIData();
