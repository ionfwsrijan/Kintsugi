export type IssueRecord = {
  id: string; title: string; description: string; category: string; urgency: string; status: string;
  confidence: number; hazards: string[]; address: string; wardId: string; latitude: number; longitude: number;
  reporterId: string; mediaPath: string; supporterCount: number; responsibleDepartment: string;
  createdAt: string; updatedAt: string; slaDueAt: string; duplicateOf: string | null; clientRequestId: string;
};
