import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateSignPose(word: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
    You are a professional Sign Language Pose Generator. 
    Your goal is to describe the static pose for the Thai Sign Language word: "${word}".
    
    Output ONLY a valid JSON object representing the skeletal rotations (in Radians) for a standard Humanoid model.
    The values should be natural for a human body.
    
    Structure:
    {
      "explanation": "Brief description of the sign in Thai",
      "poses": [
        {
          "head": { "x": 0, "y": 0, "z": 0 },
          "leftArm": { "shoulderX": 0, "shoulderZ": 0, "elbow": 0, "wristX": 0 },
          "rightArm": { "shoulderX": 0, "shoulderZ": 0, "elbow": 0, "wristX": 0 },
          "leftHand": { "thumb": 0, "index": 0, "middle": 0, "ring": 0, "pinky": 0 },
          "rightHand": { "thumb": 0, "index": 0, "middle": 0, "ring": 0, "pinky": 0 }
        }
      ]
    }

    Constraints:
    - Arm shoulderX: -1.5 to 1.5 (Up/Down)
    - Arm shoulderZ: -1.5 to 1.5 (Forward/Backward)
    - Elbow: 0 to 2.5 (Bend)
    - Hand fingers: 0 (Open) to 1.5 (Closed/Fist)
    - If the sign requires two steps, provide 2 objects in "poses" array.
    
    Word to generate: "${word}"
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Match the first JSON block found in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");

        const poseData = JSON.parse(jsonMatch[0]);
        // Ensure the structure is correct
        if (!poseData.poses || !Array.isArray(poseData.poses)) {
            throw new Error("Invalid structure: poses missing");
        }
        return poseData;
    } catch (error) {
        console.error("Gemini Pose Generation Error:", error);
        return {
            explanation: "ขออภัย ระบบไม่สามารถเจนท่าทางได้ในขณะนี้",
            poses: [{
                head: { x: 0, y: 0, z: 0 },
                leftArm: { shoulderX: 0.2, shoulderZ: 0.2, elbow: 0.2, wristX: 0 },
                rightArm: { shoulderX: 0.2, shoulderZ: 0.2, elbow: 0.2, wristX: 0 },
                leftHand: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
                rightHand: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }
            }]
        };
    }
}

// Keep the previous translateSign function if needed
export async function translateSign(videoBuffer: Buffer, targetLanguage: string = "Thai") {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const result = await model.generateContent([
        {
            inlineData: {
                data: videoBuffer.toString("base64"),
                mimeType: "video/mp4"
            }
        },
        `You are an expert Sign Language interpreter (ASL and TSL).
        
        Step-by-step instructions:
        1. Observation: Describe the specific hand-shapes and movements you see in the video.
        2. Recognition: Identify if these are American Sign Language (ASL) or Thai Sign Language (TSL) signs.
        3. Contextual Translation: Translate the detected signs into natural ${targetLanguage} text.
        
        If the video has no clear Sign Language, output "ไม่พบท่าทาง"
        
        Your output must only be the final translated text in ${targetLanguage}.`
    ]);

    const response = await result.response;
    return response.text().trim();
}
