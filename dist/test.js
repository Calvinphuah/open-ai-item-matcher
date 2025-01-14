import axios from "axios";
const response = await axios.get("http://localhost:3000/items?supplier=XYZ Traders");
console.log("Hardcoded items:", response.data);
