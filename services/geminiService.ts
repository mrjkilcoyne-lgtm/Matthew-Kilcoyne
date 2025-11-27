import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InterviewAnswers, ReportData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy, 3-5 word title for the user's new career strategy or business thesis." },
    narrative_thread: { type: Type.STRING, description: "A 2-sentence summary connecting their origin and pivot to their current state." },
    unfair_advantage: { type: Type.STRING, description: "Analysis of how their hard skill (superpower) and compliment create a unique edge." },
    confluation_thesis: { type: Type.STRING, description: "The core opportunity statement: solving the friction for the customer using their specific skills." },
    immediate_vision: { type: Type.STRING, description: "A directive on how to use their current mental fixation (forefront) to achieve their legacy." },
  },
  required: ["title", "narrative_thread", "unfair_advantage", "confluation_thesis", "immediate_vision"],
};

export const generateConfluationReport = async (answers: InterviewAnswers): Promise<ReportData> => {
  if (!apiKey) {
    // Fallback for demo if no key is present, though the prompt requires the key.
    console.warn("No API Key found. Returning mock data.");
    return {
      title: `${answers.superpower || 'Skill'} for ${answers.soft_heart || 'Passion'}`,
      narrative_thread: `You started in ${answers.origin} and navigated through ${answers.pivot}. This path built the context for your mission.`,
      unfair_advantage: `Your arsenal combines ${answers.superpower} with ${answers.compliment}. This is your unique wedge in the market.`,
      confluation_thesis: `The Opportunity: Solve the frustration of "${answers.friction}" by applying professional-grade "${answers.superpower}" standards.`,
      immediate_vision: `Your mind is fixated on "${answers.forefront}". Use this energy to build towards "${answers.legacy}".`
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are "The Confluation Engine", a high-end career strategist and biographer.
        Analyze the following interview answers from a user to construct a "Confluation Strategy".
        
        User Data:
        ${JSON.stringify(answers, null, 2)}
        
        Tone: Professional, insightful, slightly philosophical, encouraging but grounded in reality.
        Output: A JSON object matching the schema.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.7,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ReportData;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini Report Generation Error:", error);
    throw error;
  }
};

export const runMarketResearch = async (answers: InterviewAnswers): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot run live analysis.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Act as a Venture Capitalist and Market Researcher.
        
        Business Thesis:
        Combine deep expertise in "${answers.superpower}" with the market of "${answers.soft_heart}".
        Problem identified: "${answers.friction}".
        Target Customer: "${answers.customer}".
        
        Task:
        1. Perform a brief market sizing analysis (TAM/SAM/SOM estimates based on general knowledge).
        2. Identify 3 potential competitor types who might be missing this specific "expert" angle.
        3. Critique this idea brutally: what is the main failure mode?
        
        Format: Markdown. Keep it concise (under 300 words).
      `,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Research Error:", error);
    return "An error occurred while communicating with the analysis engine.";
  }
};
