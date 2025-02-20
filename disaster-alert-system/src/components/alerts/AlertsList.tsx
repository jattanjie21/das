'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/config';
import { useAlertStore } from '@/store/alertStore';
import { Alert } from '@/lib/types/alert';
import { toast } from 'react-hot-toast';

export const AlertsList = () => {
  const { alerts, setAlerts, addAlert } = useAlertStore();

  useEffect(() => {
    // Initial fetch
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch alerts');
        return;
      }

      setAlerts(data as Alert[]);
    };

    fetchAlerts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('alerts')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'alerts' 
        },
        (payload) => {
          addAlert(payload.new as Alert);
          toast.success('New alert received!');
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [setAlerts, addAlert]);

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg shadow ${
            alert.priority === 'high'
              ? 'bg-red-50 border-red-500'
              : alert.priority === 'medium'
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-green-50 border-green-500'
          } border`}
        >
          <h3 className="font-semibold">{alert.title}</h3>
          <p className="text-gray-600">{alert.content}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className={`text-sm ${
              alert.priority === 'high'
                ? 'text-red-600'
                : alert.priority === 'medium'
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}>
              {alert.priority.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(alert.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
      {alerts.length === 0 && (
        <p className="text-gray-500 text-center py-4">No alerts found</p>
      )}
    </div>
  );
}; 