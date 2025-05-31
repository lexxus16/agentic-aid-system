
import { getIncidents } from '@/app/actions';
import { IncidentCard } from '@/components/incident-card';
import { Separator } from '@/components/ui/separator';
import { ListChecks } from 'lucide-react';
import { FetchNewPostsButton } from '@/components/fetch-new-posts-button';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

export default async function DashboardPage() {
  const incidents = await getIncidents();

  return (
    <div className="space-y-8">
      <div className="flex justify-start">
        <FetchNewPostsButton />
      </div>
      
      <Separator />

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-8 flex items-center gap-3 text-primary">
          <ListChecks className="h-8 w-8" />
          Incident Feed
        </h2>
        {incidents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-foreground">No incidents reported</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click the "Check for New Incidents" button to fetch and process reports.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
