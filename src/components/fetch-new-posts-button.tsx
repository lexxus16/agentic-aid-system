
'use client';

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { fetchAndProcessNewRedditPostsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';

export function FetchNewPostsButton() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      const result = await fetchAndProcessNewRedditPostsAction();
      toast({
        title: result.success ? 'Processing Complete' : 'Processing Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending} className="mb-8">
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking for new incidents...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Check for New Incidents
        </>
      )}
    </Button>
  );
}
