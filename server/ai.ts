import { GoogleGenAI, Type } from '@google/genai';
import { env } from './config.js';
import type { IssueRecord } from './types.js';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export type Triage = {
  title: string; category: 'Roads'|'Water'|'Lighting'|'Waste'|'Safety'; urgency: 'Critical'|'High'|'Medium';
  confidence: number; hazards: string[]; summary: string; responsibleDepartment: string; slaHours: number;
  privacyRisks: string[];
};

export type CivicChatContext = {
  id: string;
  title: string;
  category: string;
  status: string;
  urgency?: string;
  address?: string;
  slaDueAt?: string;
};

const triageSchema = {
  type: Type.OBJECT,
  required: ['title','category','urgency','confidence','hazards','summary','responsibleDepartment','slaHours','privacyRisks'],
  properties: {
    title: { type: Type.STRING },
    category: { type: Type.STRING, enum: ['Roads','Water','Lighting','Waste','Safety'] },
    urgency: { type: Type.STRING, enum: ['Critical','High','Medium'] },
    confidence: { type: Type.NUMBER },
    hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
    summary: { type: Type.STRING },
    responsibleDepartment: { type: Type.STRING },
    slaHours: { type: Type.INTEGER },
    privacyRisks: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

export async function triageIssue(input: { mimeType: string; bytes: Buffer; description: string; address: string }): Promise<Triage> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [
      { text: `You are a municipal incident triage agent. Analyse the evidence conservatively. Do not identify people. Address: ${input.address}. Citizen description: ${input.description}` },
      { inlineData: { mimeType: input.mimeType, data: input.bytes.toString('base64') } }
    ]}],
    config: { responseMimeType: 'application/json', responseSchema: triageSchema, temperature: 0.1 }
  });
  const value = JSON.parse(response.text ?? '{}') as Triage;
  value.confidence = Math.max(0, Math.min(100, value.confidence));
  value.slaHours = Math.max(1, Math.min(720, value.slaHours));
  return value;
}

export async function civicAnswer(message: string, issues: CivicChatContext[]) {
  const safeContext = issues.slice(0, 30);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are Kintsugi, a concise civic copilot. Use only the provided verified issue context. Never invent authority actions. If the context is insufficient, say so. Context: ${JSON.stringify(safeContext)}\nCitizen: ${message}`,
    config: { temperature: 0.2, maxOutputTokens: 400 }
  });
  return response.text ?? 'I could not produce a grounded answer.';
}
