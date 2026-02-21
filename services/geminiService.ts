import { GoogleGenAI } from "@google/genai";

// In Vite, environment variables must be accessed via import.meta.env and prefixed with VITE_
const API_KEY = import.meta.env.VITE_API_KEY || '';

let ai: GoogleGenAI | null = null;

try {
  if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

export const getChatResponse = async (userMessage: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]): Promise<string> => {
  if (!ai) {
    // Fallback if no API key is present for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("I'm MindBridge AI (Demo Mode). I hear you, and I'm here to support you. To get real AI responses, please configure the VITE_API_KEY in your .env file.");
      }, 1000);
    });
  }

  try {
    const model = ai.models;
    const response = await model.generateContent({
     model: 'gemini-3-flash-preview',
      contents: [
        {
  role: 'user',
  parts: [{
    text: `
System Instruction: You are MindBridge, a warm, calm, and deeply empathetic mental health companion for college students.

Communication style:
- Gentle, supportive, and human-like
- Use short, soothing sentences
- Validate feelings first
- Avoid robotic tone
- Use minimal, elegant emojis occasionally (💜 🌸 ✨ 🌙)

App Features Available:
- Guided Breathing & Meditation
- Stress Relief Games
- Mood Journal
- Sleep Coach
- Peer Support Forum
- Counseling Booking

Feature Recommendation Rules:
When user expresses:
• Stress / Anxiety → Suggest Breathing, Meditation, or Games
• Sadness / Overthinking → Suggest Journal
• Sleep problems → Suggest Sleep Coach
• Loneliness → Suggest Peer Support
• Severe distress → Suggest Counseling

Recommendation Style:
- Suggest features gently, not forcefully
- Mention as helpful options inside conversation
- Example: "Would you like to try a quick breathing exercise? It can help calm your body 💜"

Goal:
Make the user feel heard, calmer, and guide them to helpful tools inside the MindBridge app.
`

  }]
},
  ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ]
    });

    return response.text || "I'm having a little trouble connecting right now, but I'm here with you.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my thought process. Let's take a deep breath together.";
  }
};

export const analyzeJournalSentiment = async (entry: string): Promise<{ sentiment: string, suggestion: string }> => {
  if (!ai) {
    return {
      sentiment: "Reflective",
      suggestion: "Writing is a great way to process emotions. Keep going!"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the sentiment of this journal entry: "${entry}". Return JSON with "sentiment" (one word like Happy, Anxious, Stressed, Calm) and a short "suggestion" (max 15 words) for coping or encouragement.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("No text returned");
  } catch (error) {
    return { sentiment: "Neutral", suggestion: "Thank you for sharing your thoughts." };
  }
};