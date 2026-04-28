import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, CalendarClock, Paperclip, FileText } from 'lucide-react';

interface ExtensionDetails {
  id: string;
  reason: string;
  requested_months: number;
  attached_file_url: string | null;
}

interface ExtensionFormProps {
  requestId: string;
}

export default function ExtensionForm({ requestId }: ExtensionFormProps) {
  const [details, setDetails] = useState<ExtensionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('form_extension_details')
          .select('*')
          .eq('request_id', requestId)
          .single();

        if (error) throw error;
        setDetails(data as ExtensionDetails);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch extension details');
      } finally {
        setIsLoading(false);
      }
    };

    if (requestId) fetchDetails();
  }, [requestId]);

  if (isLoading) return <div className="py-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>;
  if (error || !details) return <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">{error || 'Details not found'}</div>;

  return (
    <Card className="border-blue-100 shadow-sm">
      <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-3">
        <CardTitle className="text-base text-blue-900 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-blue-600" />
          Study Extension Request Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reason for Extension</h4>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{details.reason}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Requested Duration</h4>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <span className="text-2xl font-bold text-blue-600">{details.requested_months}</span>
              <span className="text-sm text-gray-500">Months</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Supporting Documents</h4>
            {details.attached_file_url ? (
              <a 
                href={details.attached_file_url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
                View Attached Document
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-gray-400">
                <FileText className="w-4 h-4" />
                No documents attached
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
