'use server';

import { revalidatePath } from 'next/cache';
import { summarizeIncident } from '@/ai/flows/summarize-incident';
import { db } from '@/lib/firebase-admin'; // Using the mock db for now
import type { Incident, IncidentStatus, WhatsAppResponseType } from '@/types/incident';

export async function getIncidents(): Promise<Incident[]> {
  try {
    const snapshot = await db.collection('incidents').orderBy('extractedAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    let incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
    
    // Manual sort if mock orderBy doesn't work as expected for dates
    incidents.sort((a, b) => new Date(b.extractedAt).getTime() - new Date(a.extractedAt).getTime());
    
    return incidents;
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return [];
  }
}

export async function addIncidentAction(formData: FormData): Promise<{ success: boolean; message?: string; incidentId?: string }> {
  const redditPostContent = formData.get('redditPostContent') as string;

  if (!redditPostContent || redditPostContent.trim() === '') {
    return { success: false, message: 'Reddit post content cannot be empty.' };
  }

  try {
    const summaryResult = await summarizeIncident({ redditPostContent });
    const geminiSummary = summaryResult.summary;

    const newIncident: Omit<Incident, 'id'> = {
      redditPostId: `rd_${Date.now()}`, // Mock Reddit Post ID
      redditPostContent,
      geminiSummary,
      extractedAt: new Date().toISOString(),
      status: 'Pending',
      // Simulate WhatsApp alert sent
      whatsAppSentAt: new Date().toISOString(), 
    };

    const docRef = await db.collection('incidents').add(newIncident);
    
    revalidatePath('/'); // Revalidate dashboard page
    return { success: true, message: 'Incident added and summary generated.', incidentId: docRef.id };
  } catch (error: any) {
    console.error("Error in addIncidentAction:", error);
    return { success: false, message: error.message || 'Failed to add incident.' };
  }
}

export async function updateIncidentStatusAction(
  incidentId: string,
  status: IncidentStatus,
  response?: WhatsAppResponseType
): Promise<{ success: boolean; message?: string }> {
  try {
    const updateData: Partial<Incident> = { status };
    if (response) {
      updateData.whatsAppResponse = response;
      updateData.whatsAppResponseAt = new Date().toISOString();
    }

    // Logic for "Real" -> Forward to NGOs (mock)
    if (status === 'Verified' && response === 'Real') {
      console.log(`Incident ${incidentId} verified as Real. Forwarding to NGOs/media (mocked).`);
      // Here you would implement actual email/SMS forwarding
    }

    // Logic for "Not Confirmed" -> Set timer (mock)
    if (status === 'On Hold' && response === 'Not Confirmed') {
      updateData.lastVerificationAttemptAt = new Date().toISOString(); // Resetting timer for resend
      console.log(`Incident ${incidentId} marked as Not Confirmed. Will resend verification in 24h (mocked).`);
    }
    
    await db.collection('incidents').doc(incidentId).update(updateData);
    revalidatePath('/');
    return { success: true, message: `Incident ${incidentId} status updated to ${status}.` };
  } catch (error: any) {
    console.error("Error updating incident status:", error);
    return { success: false, message: error.message || 'Failed to update incident status.' };
  }
}

export async function resendVerificationAction(incidentId: string): Promise<{ success: boolean; message?: string }> {
  try {
    await db.collection('incidents').doc(incidentId).update({
      lastVerificationAttemptAt: new Date().toISOString(),
      // Potentially reset status to 'Pending' or keep 'On Hold'
      // status: 'Pending', 
      whatsAppSentAt: new Date().toISOString(), // Mark as resent
    });
    console.log(`Verification resent for incident ${incidentId} (mocked).`);
    revalidatePath('/');
    return { success: true, message: `Verification resent for incident ${incidentId}.` };
  } catch (error: any) {
    console.error("Error resending verification:", error);
    return { success: false, message: error.message || 'Failed to resend verification.' };
  }
}
