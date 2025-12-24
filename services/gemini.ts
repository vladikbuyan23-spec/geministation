
import { GoogleGenAI } from "@google/genai";

export const getGeminiRecommendation = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are GeminiStation AI, a console dashboard assistant. 
      The user is asking: "${prompt}". 
      Respond as a futuristic, helpful AI assistant. Keep it concise (max 3 sentences).`,
    });
    return response.text || "I'm sorry, I'm having trouble connecting to the neural stream.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The system is currently undergoing maintenance. Please try again later.";
  }
};
