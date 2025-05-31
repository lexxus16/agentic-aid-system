'use client';

import React, { useRef, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addIncidentAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
  incidentId: undefined as string | undefined,
};

export function IncidentForm() {
  const [state, formAction] = useFormState(addIncidentAction, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [textareaValue, setTextareaValue] = useState('');


  React.useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        formRef.current?.reset();
        setTextareaValue(''); // Clear textarea state
      }
    }
  }, [state, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Report New Incident</CardTitle>
        <CardDescription>
          Manually enter Reddit post content to generate an incident report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="redditPostContent" className="text-sm font-medium">
              Reddit Post Content
            </Label>
            <Textarea
              id="redditPostContent"
              name="redditPostContent"
              placeholder="Paste the content of the Reddit post here..."
              rows={6}
              required
              className="bg-white dark:bg-muted"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Incident'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
