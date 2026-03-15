const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function listModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    console.log("Available Models:");
    if (data.models) {
      for (const model of data.models) {
        console.log(`- ${model.name} (${model.supportedGenerationMethods.join(', ')})`);
      }
    } else {
      console.log("No models found or error occurred:", data);
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
