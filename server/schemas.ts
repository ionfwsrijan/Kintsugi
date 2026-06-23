import { z } from 'zod';

export const categories = ['Roads', 'Water', 'Lighting', 'Waste', 'Safety'] as const;
export const statuses = ['Reported', 'Verified', 'Assigned', 'In progress', 'Resolved'] as const;

export const issueInputSchema = z.object({
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(5).max(1200),
  category: z.enum(categories).optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().trim().min(3).max(240),
  wardId: z.string().trim().min(1).max(40),
  clientRequestId: z.string().uuid()
});

export const verifySchema = z.object({ evidence: z.string().trim().max(500).optional() });
export const statusSchema = z.object({ status: z.enum(statuses), note: z.string().trim().min(3).max(500) });
export const chatContextSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  status: z.string(),
  urgency: z.string().optional(),
  address: z.string().optional(),
  slaDueAt: z.string().optional()
});

export const chatSchema = z.object({
  message: z.string().trim().min(2).max(800),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  context: z.array(chatContextSchema).optional()
});

export const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(60).optional(),
  neighbourhood: z.string().trim().min(2).max(80).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  wardId: z.string().trim().min(1).max(40).optional(),
  notificationsEnabled: z.boolean().optional(),
  language: z.enum(['English', 'Hindi', 'Kannada']).optional()
}).refine(value => Object.keys(value).length > 0, 'At least one profile field is required');

export const rewardSchema = z.object({ rewardId: z.enum(['metro-pass', 'tree-kit', 'cafe-credit']) });
