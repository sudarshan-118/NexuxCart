'use server';

import { GoogleGenAI, Type } from '@google/genai';
import { mockDb } from './db';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'dummy' });

export async function analyzeProductReviews(productId: string) {
  const reviews = mockDb.reviews.filter((r) => r.productId === productId);
  if (reviews.length === 0) return { score: 0, summary: "No reviews yet." };

  const prompt = `Analyze these product reviews: ${JSON.stringify(reviews.map((r) => `${r.rating}/5: ${r.text}`))}. 
  Return a JSON object with strictly two fields: 
  1. "score": a number from 1.0 to 10.0 representing the aggregate sentiment.
  2. "summary": A compelling one-line summary of what users think.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["score", "summary"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { score: 7.5, summary: "Mixed but generally positive feedback from users." };
  }
}

export async function getRecommendations(userId: string) {
  const userOrders = mockDb.orders.filter((o) => o.userId === userId);
  const products = mockDb.products.map(p => ({ id: p.id, name: p.name, category: p.category }));
  
  const prompt = `You are a recommendation engine. We are currently in the Spring/Summer season (trending time). 
  The user has bought these items previously: ${JSON.stringify(userOrders.flatMap(o => o.items.map(i => i.productId)))}. 
  Here is our catalog: ${JSON.stringify(products)}. 
  Recommend exactly 3 product IDs that the user might like next based on their purchase history, and also general trending items.
  Return a JSON array of strings containing just the 3 product IDs.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });
    const recommendedIds = JSON.parse(response.text || '[]');
    return mockDb.products.filter(p => recommendedIds.includes(p.id));
  } catch (e) {
    return mockDb.products.slice(0, 3);
  }
}

export async function chatAssistant(messages: { role: string, content: string }[]) {
    const products = mockDb.products.map(p => `${p.name} (₹${p.price}) - ${p.category}`).join("\n");
    const sysInst = `You are a helpful customer support bot for an e-commerce store called NexusCart. 
    Here is our current catalog:\n${products}\n
    Help the user find products, compare them, or answer general questions. Keep it brief, friendly, and use markdown.`;

    const chat = ai.chats.create({
        model: 'gemini-3.1-flash-lite-preview',
        config: { systemInstruction: sysInst }
    });
    
    let historyText = "";
    if (messages.length > 1) {
       historyText = messages.slice(0, -1).map((m) => `${m.role}: ${m.content}`).join('\n');
    }
    const lastMsg = messages[messages.length - 1].content;
    
    let finalMsg = lastMsg;
    if (historyText) {
       finalMsg = `History:\n${historyText}\n\nUser: ${lastMsg}`;
    }

    try {
      const response = await chat.sendMessage({ message: finalMsg });
      return response.text;
    } catch(e: any) {
      return "Sorry, I am having trouble connecting to my brain right now. Our AI is currently offline.";
    }
}
