# OpenAI Item Matcher

A Node.js and TypeScript application that leverages OpenAI's GPT-4 model to match user input with the closest supplier name or item description. This project is designed for industries like construction or procurement, where quick and accurate supplier or item identification is essential.

---

## **Features**

- Extract supplier names and item descriptions from a JSON server.
- Use OpenAI to find the closest supplier or item description intelligently.
- Handles regional/industry-specific terminology, such as "Moxy" for "Dump Truck," currently tailored to Australian construction standards but adaptable for other regions or industries.
- Modular and extensible design for easy customization.

---

## **Prerequisites**

1. **Node.js**: Ensure you have Node.js (v14 or later) installed.
2. **OpenAI API Key**:

   - Get your OpenAI API key from the [OpenAI Developer Platform](https://platform.openai.com/signup/).
   - Save it in a `.env` file in the root of the project:
     ```plaintext
     OPENAI_API_KEY=your_openai_api_key
     ```

3. **JSON Server**:

   - Install JSON Server globally:
     ```bash
     npm install -g json-server
     ```

4. **Install Dependencies**:
   - Navigate to the project directory and run:
     ```bash
     npm install
     ```

---

## **Setup**

### **1. Start JSON Server**

Create a `db.json` file in the project root with the following content:

```json
{
  "suppliers": [
    { "name": "ABC Supplies" },
    { "name": "XYZ Traders" },
    { "name": "Construction Hub" }
  ],
  "items": [
    {
      "id": 1,
      "supplier": "ABC Supplies",
      "description": "Dump Truck - Heavy Duty",
      "price": 100000,
      "rate": 5000
    },
    {
      "id": 2,
      "supplier": "ABC Supplies",
      "description": "Excavator - Compact",
      "price": 75000,
      "rate": 4000
    },
    {
      "id": 3,
      "supplier": "XYZ Traders",
      "description": "Bulldozer - Large",
      "price": 150000,
      "rate": 7000
    },
    {
      "id": 4,
      "supplier": "Construction Hub",
      "description": "Crane - Mobile",
      "price": 200000,
      "rate": 10000
    }
  ]
}
```

Start the JSON Server:

```bash
json-server --watch db.json --port 3000
```

### **2. Set Up OpenAI API**

Ensure your .env file is configured with your OpenAI API key:

```plaintext
OPENAI_API_KEY=your_openai_api_key
```

## **Usage**

### **1. Start the Application**

Run the application using Node.js:

```bash
node dist/app.js
```

### **2. Example Interaction**

Test the application's capabilities by entering varying supplier names and item descriptions. The AI is designed to handle differing inputs, including typos and alternative terminology, showcasing its flexibility and intelligence.

```plaintext
What is the supplier name?
> abc

Closest supplier: ABC Supplies

Available items:
[ 'Dump Truck - Heavy Duty', 'Excavator - Compact' ]

What is the item description e.g. Dump Truck/ Moxy?
> moxy

Closest item found: {
  "id": 1,
  "supplier": "ABC Supplies",
  "description": "Dump Truck - Heavy Duty",
  "price": 100000,
  "rate": 5000
}

```

## **Folder Structure**

```bash
.
├── dist/
│   ├── config/
│   │   └── openaiConfig.js       # OpenAI API configuration
│   ├── controllers/
│   │   └── openaiController.js   # Logic for interacting with OpenAI
│   └── app.js                    # Main application logic
├── db.json                        # Sample JSON server data
├── .env                           # OpenAI API key
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```
