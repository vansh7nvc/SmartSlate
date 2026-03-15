const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const modelList = await genAI.listModels();
    console.log("Available Models:");
    for (const model of modelList.models) {
      console.log(`- ${model.name} (${model.supportedGenerationMethods})`);
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
