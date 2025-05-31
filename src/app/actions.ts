
'use server';

import { revalidatePath } from 'next/cache';
import { summarizeIncident } from '@/ai/flows/summarize-incident';
import { db } from '@/lib/firebase-admin';
import type { Incident, IncidentStatus, WhatsAppResponseType } from '@/types/incident';
import { getMockRedditPosts, type MockRedditPost } from '@/lib/mock-reddit';

export async function getIncidents(): Promise<Incident[]> {
  try {
    const snapshot = await db.collection('incidents').orderBy('extractedAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    let incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
    
    incidents.sort((a, b) => new Date(b.extractedAt).getTime() - new Date(a.extractedAt).getTime());
    
    return incidents;
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return [];
  }
}

export async function fetchAndProcessNewRedditPostsAction(): Promise<{ success: boolean; message: string; newIncidentsCount: number }> {
  try {
    const mockPosts = getMockRedditPosts();
    const existingIncidents = await getIncidents();
    const existingRedditPostIds = new Set(existingIncidents.map(inc => inc.redditPostId));
    
    let newIncidentsCount = 0;
    const processingPromises: Promise<void>[] = [];

    for (const post of mockPosts) {
      if (!existingRedditPostIds.has(post.id)) {
        processingPromises.push(
          (async () => {
            const summaryResult = await summarizeIncident({ redditPostContent: post.content });
            
            const newIncident: Omit<Incident, 'id'> = {
              redditPostId: post.id,
              redditPostContent: post.content,
              geminiSummary: summaryResult.summary,
              category: summaryResult.category,
              extractedAt: post.createdAt, // Use post's creation time
              status: 'Pending',
              whatsAppSentAt: new Date().toISOString(), // Simulate initial alert sent
            };

            await db.collection('incidents').add(newIncident);
            newIncidentsCount++;
          })()
        );
      }
    }

    await Promise.all(processingPromises);

    if (newIncidentsCount > 0) {
      revalidatePath('/');
      return { success: true, message: `Successfully processed ${newIncidentsCount} new incident(s).`, newIncidentsCount };
    } else {
      return { success: true, message: 'No new incidents found to process.', newIncidentsCount: 0 };
    }

  } catch (error: any) {
    console.error("Error in fetchAndProcessNewRedditPostsAction:", error);
    return { success: false, message: error.message || 'Failed to fetch or process new incidents.', newIncidentsCount: 0 };
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

    if (status === 'Verified' && response === 'Real') {
      console.log(`Incident ${incidentId} verified as Real. Forwarding to NGOs/media (mocked).`);
    }

    if (status === 'On Hold' && response === 'Not Confirmed') {
      updateData.lastVerificationAttemptAt = new Date().toISOString(); 
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
      whatsAppSentAt: new Date().toISOString(), 
    });
    console.log(`Verification resent for incident ${incidentId} (mocked).`);
    revalidatePath('/');
    return { success: true, message: `Verification resent for incident ${incidentId}.` };
  } catch (error: any) {
    console.error("Error resending verification:", error);
    return { success: false, message: error.message || 'Failed to resend verification.' };
  }
}
