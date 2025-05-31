
'use client';

import type { Incident, IncidentStatus, WhatsAppResponseType } from '@/types/incident';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle2, XCircle, Clock, Send, ThumbsUp, ThumbsDown, HelpCircle, MessageSquareText, FileText, Sparkles, CalendarDays, Check, Ban, Loader2, Tag } from 'lucide-react';
import { updateIncidentStatusAction, resendVerificationAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface IncidentCardProps {
  incident: Incident;
}

const StatusIcon = ({ status }: { status: IncidentStatus }) => {
  switch (status) {
    case 'Pending':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'Verified':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'Fake':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'On Hold':
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status: IncidentStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Pending': return 'secondary';
    case 'Verified': return 'default'; 
    case 'Fake': return 'destructive';
    case 'On Hold': return 'outline'; 
    default: return 'secondary';
  }
}

const getCategoryBadgeVariant = (category?: string): "default" | "secondary" | "outline" => {
    if (!category) return "secondary";
    // Simple logic for category color, can be expanded
    if (["Fire", "Crime", "Public Safety"].includes(category)) return "destructive";
    if (["Traffic", "Utility Outage"].includes(category)) return "outline";
    return "secondary";
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const { toast } = useToast();
  const [isUpdating, startUpdateTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);

  const handleUpdateStatus = (status: IncidentStatus, response?: WhatsAppResponseType) => {
    startUpdateTransition(async () => {
      const result = await updateIncidentStatusAction(incident.id, status, response);
      toast({
        title: result.success ? 'Status Updated' : 'Update Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  };

  const handleResend = () => {
    startResendTransition(async () => {
      const result = await resendVerificationAction(incident.id);
      toast({
        title: result.success ? 'Verification Resent' : 'Resend Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  };

  const isLoading = isUpdating || isResending;

  return (
    <Card className="w-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl animate-in fade-in-0 slide-in-from-bottom-5 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <MessageSquareText className="h-6 w-6 text-primary" />
              Incident Report
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              ID: {incident.id.substring(0,10)}... (Reddit: {incident.redditPostId.substring(0,10)}...)
            </CardDescription>
          </div>
           <div className="flex flex-col items-end gap-1">
            <Badge variant={getStatusBadgeVariant(incident.status)} className="flex items-center gap-1.5 py-1 px-2.5">
              <StatusIcon status={incident.status} />
              {incident.status}
            </Badge>
            {incident.category && (
              <Badge variant={getCategoryBadgeVariant(incident.category)} className="flex items-center gap-1.5 py-1 px-2 text-xs">
                <Tag className="h-3.5 w-3.5" />
                {incident.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div>
          <h4 className="font-semibold text-sm mb-1 flex items-center gap-1.5"><FileText className="h-4 w-4 text-muted-foreground"/> Original Post Content:</h4>
          <div className="text-sm bg-muted/50 p-3 rounded-md max-h-32 overflow-y-auto text-muted-foreground">
            <p className={!expanded && "line-clamp-3"}>
              {incident.redditPostContent}
            </p>
          </div>
           {incident.redditPostContent.length > 150 && (
            <Button variant="link" size="sm" onClick={() => setExpanded(!expanded)} className="p-0 h-auto mt-1 text-accent-foreground hover:text-primary">
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
        <Separator />
        <div>
          <h4 className="font-semibold text-sm mb-1 flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-accent"/> AI Generated Summary:</h4>
          <p className="text-sm bg-accent/20 p-3 rounded-md text-accent-foreground italic">
            {incident.geminiSummary}
          </p>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Reported: {formatDistanceToNow(parseISO(incident.extractedAt), { addSuffix: true })}
        </div>
        {incident.whatsAppResponse && (
             <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                {incident.whatsAppResponse === "Real" && <Check className="h-3.5 w-3.5 text-green-600" />}
                {incident.whatsAppResponse === "Fake" && <Ban className="h-3.5 w-3.5 text-red-600" />}
                {incident.whatsAppResponse === "Not Confirmed" && <HelpCircle className="h-3.5 w-3.5 text-blue-600" />}
                Authority Response: {incident.whatsAppResponse} ({incident.whatsAppResponseAt ? formatDistanceToNow(parseISO(incident.whatsAppResponseAt), { addSuffix: true }) : 'N/A'})
            </div>
        )}

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t mt-auto">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
            onClick={() => handleUpdateStatus('Verified', 'Real')}
            disabled={isLoading || incident.status === 'Verified'}
            aria-label="Mark as Real"
          >
            {isLoading && incident.status !== 'Verified' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp />}
            Real
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
            onClick={() => handleUpdateStatus('Fake', 'Fake')}
            disabled={isLoading || incident.status === 'Fake'}
            aria-label="Mark as Fake"
          >
            {isLoading && incident.status !== 'Fake' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown />}
            Fake
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
            onClick={() => handleUpdateStatus('On Hold', 'Not Confirmed')}
            disabled={isLoading || incident.status === 'On Hold'}
            aria-label="Mark as Not Confirmed"
          >
            {isLoading && incident.status !== 'On Hold' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HelpCircle />}
            Not Confirmed
          </Button>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-accent-foreground hover:text-primary"
          onClick={handleResend}
          disabled={isLoading}
          aria-label="Resend Verification"
        >
          {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send />}
          Resend Verification
        </Button>
      </CardFooter>
    </Card>
  );
}
