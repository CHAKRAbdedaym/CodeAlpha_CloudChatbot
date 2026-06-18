import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

async function main() {
  try {
    console.log("Testing Gemini API with key:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.slice(0, 10) + "...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you there?");
    console.log("Response:", result.response.text());
  } catch (e: any) {
    console.error("Gemini Test Failed!");
    console.error(e.message);
    if (e.message.includes("API_KEY_INVALID")) {
       console.error("CONFIRMED: The API Key is invalid.");
    }
  }
}

main();
