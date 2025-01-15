import axios from "axios";
import {
  findClosestSupplierWithOpenAI,
  matchClosestItem,
} from "./controllers/openaiController.js";
import documentAIData from "../docaiData.json" assert { type: "json" };

// Fetch suppliers from json-server
const fetchSuppliers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/suppliers");
    return response.data.map((supplier) => supplier.name);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

// Fetch items for a specific supplier
const fetchSupplierItems = async (supplierName) => {
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

// Process Document AI Data Sequentially
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
    const matchedItems = [];
    for (const lineItem of documentAIData.line_items) {
      const description = lineItem["line_item/description"];
      console.log("Line Item (DOC AI) Description:", description);

      const matchingItem = await matchClosestItem(description, supplierItems);

      if (matchingItem) {
        const combinedItem = {
          ...matchingItem,
          quantity: lineItem["line_item/quantity"],
        };
        matchedItems.push(combinedItem);

        // Log the matched and combined item details
        console.log("Matched Item Description:", matchingItem.description);
        console.log("Combined Item with quantity and rate:", combinedItem);
      } else {
        console.warn(`No match found for line item: ${description}`);
      }
    }

    return matchedItems;
  } catch (error) {
    console.error("Error processing Document AI data:", error);
    throw error;
  }
};

// Start processing
processDocumentAIData();
