import axios from "axios";
import readline from "readline";
import {
  findClosestSupplierWithOpenAI,
  matchClosestItem,
} from "./controllers/openaiController.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fetch suppliers from json-server
const fetchSuppliers = async (): Promise<string[]> => {
  const response = await axios.get("http://localhost:3000/suppliers");
  return response.data.map((supplier: { name: string }) => supplier.name);
};

// Fetch items for a specific supplier
const fetchSupplierItems = async (supplierName: string): Promise<any[]> => {
  console.log("supplierName", supplierName);
  try {
    const trimmedName = supplierName.trim();
    console.log("trimmedName", trimmedName);
    const response = await axios.get(
      `http://localhost:3000/items?supplier=${encodeURIComponent(supplierName)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items for supplier:", error);
    throw error;
  }
};

// Step 1: Fetch all supplier names
const supplierNames = await fetchSuppliers();
console.log("Available suppliers:", supplierNames);

// Prompt the user for a supplier name and item description
rl.question("What is the supplier name? \n", async (supplierInput) => {
  try {
    const closestSupplier = await findClosestSupplierWithOpenAI(
      supplierInput,
      supplierNames
    );
    console.log(`Closest supplier: ${closestSupplier}`);

    // Step 2: Fetch items for the closest supplier
    const items = await fetchSupplierItems(closestSupplier);
    console.log("items", items);
    console.log(
      "Available items:",
      items.map((item) => item.description)
    );

    // Step 3: Prompt the user for a description of the item

    rl.question(
      "What is the item description e.g. Dump Truck/ Moxy? \n",
      async (itemInput) => {
        const matchingItem = await matchClosestItem(itemInput, items);

        if (matchingItem) {
          console.log(`Closest item found: ${JSON.stringify(matchingItem)}`);
        } else {
          console.log("No item found.");
        }

        rl.close();
      }
    );
  } catch (error) {
    console.error("Error:", error);
    rl.close();
  }
});
