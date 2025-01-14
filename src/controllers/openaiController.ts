import openai from "../config/openaiConfig.js";

/**
 * Utility function to clean the OpenAI response.
 * Removes surrounding quotation marks and trims whitespace.
 */
const cleanResponse = (response: string): string => {
  return response.replace(/^"|"$/g, "").trim();
};

/**
 * Finds the closest matching supplier name using OpenAI.
 */
const findClosestSupplierWithOpenAI = async (
  input: string,
  suppliers: string[]
): Promise<string> => {
  const prompt = `
    I have a list of supplier names: ${JSON.stringify(suppliers)}.
    Based on the input "${input}", find the closest matching supplier name.
    Return only the closest matching name, without any explanation.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 50,
    });

    const rawResponse = completion.choices[0].message?.content?.trim();
    if (!rawResponse) {
      throw new Error("No response from OpenAI.");
    }

    console.log("Raw OpenAI response (supplier):", rawResponse);

    const cleanedResponse = cleanResponse(rawResponse);
    console.log("Cleaned response (supplier):", cleanedResponse);

    return cleanedResponse;
  } catch (error) {
    console.error("Error finding closest supplier:", error);
    throw error;
  }
};

/**
 * Finds the closest matching item based on its description using OpenAI.
 */
const matchClosestItem = async (
  input: string,
  items: Item[]
): Promise<Item | null> => {
  const prompt = `
    You are an assistant knowledgeable in Australian Construction Naming Standards.
    I have a list of item descriptions: ${JSON.stringify(
      items.map((item) => item.description)
    )}.
    Based on the input "${input}", find the closest matching item description. Be aware that some items may have alternative names, for example, dump truck is Moxy in Australia.
    Return only the closest matching name, without any explanation.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant with expertise in Australian construction terminology.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });

    const rawResponse = completion.choices[0].message?.content?.trim();
    if (!rawResponse) {
      throw new Error("No response received from OpenAI.");
    }

    // console.log("Raw OpenAI response (item):", JSON.stringify(rawResponse));
    // console.log("Items in function:", items);

    const cleanedResponse = cleanResponse(rawResponse);
    // console.log("Cleaned response (item):", cleanedResponse);

    const item = items.find((item) => item.description === cleanedResponse);
    // console.log("Found item:", item);

    return item || null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error matching closest item:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    return null;
  }
};

interface Item {
  id: number;
  supplier: string;
  description: string;
  price: number;
  rate: number;
}

export { findClosestSupplierWithOpenAI, matchClosestItem };
