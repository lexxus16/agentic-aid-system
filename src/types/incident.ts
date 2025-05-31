export type IncidentStatus = 'Pending' | 'Verified' | 'Fake' | 'On Hold';
export type WhatsAppResponseType = 'Real' | 'Fake' | 'Not Confirmed';

export interface Incident {
  id: string;
  redditPostId: string; // For MVP, can be a generated ID or hash
  redditPostContent: string;
  geminiSummary: string;
  extractedAt: string; // ISO string date
  status: IncidentStatus;
  whatsAppSentAt?: string; // ISO string date
  whatsAppResponse?: WhatsAppResponseType;
  whatsAppResponseAt?: string; // ISO string date
  lastVerificationAttemptAt?: string; // ISO string date
  // Future fields:
  // location?: string;
  // incidentType?: string; // e.g., "Violence", "Accident", "Explosion"
}
