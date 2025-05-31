
export type IncidentStatus = 'Pending' | 'Verified' | 'Fake' | 'On Hold';
export type WhatsAppResponseType = 'Real' | 'Fake' | 'Not Confirmed';

export interface Incident {
  id: string;
  redditPostId: string; 
  redditPostContent: string;
  geminiSummary: string;
  category?: string; // Added category
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
