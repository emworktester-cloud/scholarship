import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import ExtensionForm from './ExtensionForm';

// Define TS types based on DB schema
interface EFormRequest {
  id: string;
  user_id: string;
  form_type: string;
  current_status: string;
  current_zone_id: number | null;
  created_at: string;
}

interface WorkflowLog {
  id: string;
  actor_id: string;
  action: string;
  comment: string;
  created_at: string;
}

interface EFormViewerProps {
  requestId: string;
  currentUserId: string; // The ID of the admin viewing the form
}

export default function EFormViewer({ requestId, currentUserId }: EFormViewerProps) {
  const [request, setRequest] = useState<EFormRequest | null>(null);
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const fetchWorkflowData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch Header
      const { data: reqData, error: reqError } = await supabase
        .from('e_form_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (reqError) throw reqError;
      setRequest(reqData as EFormRequest);

      // 2. Fetch Logs
      const { data: logData, error: logError } = await supabase
        .from('workflow_approval_logs')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });

      if (logError) throw logError;
      setLogs(logData as WorkflowLog[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch workflow data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchWorkflowData();
    }
  }, [requestId]);

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!request) return;
    setIsProcessing(true);
    try {
      const nextStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      
      const { error } = await supabase.rpc('process_workflow_action', {
        p_request_id: parseInt(requestId, 10),
        p_actor_id: parseInt(currentUserId, 10),
        p_action: action,
        p_next_status: nextStatus,
        p_comment: comment
      });

      if (error) throw error;
      
      setComment('');
      await fetchWorkflowData(); // Refresh UI
    } catch (err: any) {
      setError(err.message || `Failed to ${action.toLowerCase()} request`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  if (error || !request) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error || 'Request not found'}</div>;
  }

  const renderChildForm = () => {
    switch (request.form_type) {
      case 'EXTENSION':
        return <ExtensionForm requestId={requestId} />;
      default:
        return <div className="p-4 bg-gray-50 rounded-lg text-gray-500 border border-gray-200">Unknown form type: {request.form_type}</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Request #{request.id}</h2>
          <p className="text-sm text-gray-500">Submitted on {new Date(request.created_at).toLocaleString()}</p>
        </div>
        <Badge className={
          request.current_status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
          request.current_status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
          'bg-amber-100 text-amber-800 border-amber-200'
        }>
          {request.current_status}
        </Badge>
      </div>

      {renderChildForm()}

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
          <CardTitle className="text-sm font-semibold text-gray-800">Workflow Actions & Audit Log</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {request.current_status === 'PENDING' && (
            <div className="space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your review comment or reason..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow"
                rows={3}
                disabled={isProcessing}
              />
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => handleAction('APPROVE')} 
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Approve Request
                </Button>
                <Button 
                  onClick={() => handleAction('REJECT')} 
                  disabled={isProcessing}
                  variant="destructive"
                  className="font-medium"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                  Reject Request
                </Button>
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Approval Timeline</h4>
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                {logs.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white" />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{log.action} <span className="font-normal text-gray-500">by Actor ID: {log.actor_id}</span></span>
                      <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    {log.comment && <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 p-3 rounded-lg mt-2">{log.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
