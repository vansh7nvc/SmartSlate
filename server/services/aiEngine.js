const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

const processMeetingFile = async (meeting) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });
    const filePath = path.resolve(meeting.filePath);
    const fileBuffer = fs.readFileSync(filePath);
    let result;
    let prompt;

    let mimeType;
    if (meeting.fileType === 'pdf') {
      mimeType = "application/pdf";
      prompt = `Please provide:
      1. A transcription (or text extraction).
      2. A 3-paragraph summary.
      3. A bulleted list of action items.
      4. A list of 5-8 Flashcards (Question and Answer pairs).
      5. A Glossary of 5 key terms with definitions.
      
      Format the output as a SINGLE JSON object with the following keys: "transcript" (string), "summary" (string), "actionItems" (array of strings), "flashcards" (array of objects {q, a}), "glossary" (array of objects {term, definition}).
      CRITICAL: Return ONLY the raw JSON. No markdown code blocks, no intro, no outro. Ensure ALL special characters in strings are properly escaped for JSON. Do NOT include trailing commas.`;
    } else {
      // Audio processing (.mp3, .wav)
      mimeType = meeting.fileType === 'wav' ? "audio/wav" : "audio/mpeg";
      prompt = `Listen to this audio and provide:
      1. A full transcript.
      2. A 3-paragraph summary.
      3. A bulleted list of action items.
      4. A list of 5-8 Flashcards (Question and Answer pairs).
      5. A Glossary of 5 key terms with definitions.
      
      Format the output as a SINGLE JSON object with the following keys: "transcript" (string), "summary" (string), "actionItems" (array of strings), "flashcards" (array of objects {q, a}), "glossary" (array of objects {term, definition}).
      CRITICAL: Return ONLY the raw JSON. No markdown code blocks, no intro, no outro. Ensure ALL special characters in strings are properly escaped for JSON. Do NOT include trailing commas.`;
    }

    // Upload the file to Gemini using File API
    console.log(`Uploading ${meeting.fileName} to Gemini...`);
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType,
      displayName: meeting.fileName,
    });
    
    console.log(`Upload complete: ${uploadResult.file.uri}`);

    result = await model.generateContent([
      prompt,
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri
        }
      }
    ]);

    const response = await result.response;
    let text = response.text().trim();
    console.log("Full Gemini Response:", text);
    
    // Multi-stage JSON extraction
    let parsedData = null;
    
    // Stage 1: Direct Parse
    try {
      parsedData = JSON.parse(text);
    } catch (e1) {
      console.warn("Stage 1 parse failed, trying code block stripping...");
      
      // Stage 2: Code Block Stripping
      try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      } catch (e2) {
        console.warn("Stage 2 parse failed, trying regex extraction...");
        
        // Stage 3: Regex Extraction (Find most outer brackets)
        try {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            // Apply deep cleaning only to the segment matched
            let segment = match[0]
              .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Comments
              .replace(/,\s*([\]}])/g, '$1');                      // Trailing commas
            parsedData = JSON.parse(segment);
          }
        } catch (e3) {
          console.warn("Stage 3 parse failed, trying aggressive repair...");
          
          // Stage 4: Smart Delimiter Repair
          let repaired = text.match(/\{[\s\S]*\}/)?.[0] || text;
          try {
            // Fix missing commas between common patterns
            repaired = repaired
              .replace(/\}\s*\{/g, '}, {')    // } { -> }, {
              .replace(/\]\s*\[/g, '], [')    // ] [ -> ], [
              .replace(/"\s+"/g, '", "')      // "a" "b" -> "a", "b"
              .replace(/\}\s*"/g, '}, "')     // } "a" -> }, "a"
              .replace(/"\s*\{/g, '", {')     // "a" { -> "a", {
              .replace(/\]\s*"/g, '], "')     // ] "a" -> ], "a"
              .replace(/"\s*\[/g, '", [')     // "a" [ -> ", [
              .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Strip comments
              .replace(/,\s*([\]}])/g, '$1');                      // Strip trailing commas
            
            parsedData = JSON.parse(repaired);
            console.log("Stage 4 repair SUCCEEDED.");
          } catch (e4) {
            console.warn("Stage 4 repair failed, trying Stage 5 (Desperate Sanitization)...");
            // Stage 5: Truly desperate - strip control characters and normalize boundaries
            try {
              let desperate = repaired
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Strip weird control chars
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ');
              desperate = desperate.replace(/\}\s*\{/g, '}, {').replace(/"\s*"/g, '", "');
              parsedData = JSON.parse(desperate);
              console.log("Stage 5 sanitization SUCCEEDED.");
            } catch (e5) {
              console.error("All JSON parsing stages failed.");
              const debugPath = path.join(process.cwd(), 'debug_malformed_response.json');
              fs.writeFileSync(debugPath, text);
              console.log("Malformed response saved to:", debugPath);
              throw new Error(`AI response was not valid JSON. Error: ${e1.message}`);
            }
          }
        }
      }
    }

    console.log("Extracted AI Data Keys:", Object.keys(parsedData));
    console.log("Flashcards Count:", parsedData.flashcards?.length || 0);
    console.log("Glossary Count:", parsedData.glossary?.length || 0);
    
    if (!parsedData) throw new Error("Could not extract JSON from AI response");
    return parsedData;
  } catch (error) {
    console.error("Gemini Processing Error:", error);
    throw error;
  }
};

const askAILesson = async (meeting, query) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.7 } 
    });
    const context = `Context: This is a lesson/meeting titled "${meeting.title}".
    Transcription: ${meeting.transcript}
    Summary: ${meeting.summary}
    
    User Question: ${query}
    
    Please provide a concise, helpful answer based ONLY on the context provided above. If the answer isn't in the context, say you don't have enough information from this lesson.`;

    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

module.exports = { processMeetingFile, askAILesson };
