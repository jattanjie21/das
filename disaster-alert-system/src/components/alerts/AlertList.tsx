'use client';

import { useEffect, useState } from 'react';
import { Card, Title, Text, Badge } from '@tremor/react';
import { Alert } from '@/lib/types/alert';
import { supabase } from '@/lib/supabase/config';
import { toast } from 'react-hot-toast';

interface AlertListProps {
  zoneId?: string;
}

export function AlertList({ zoneId }: AlertListProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const url = zoneId ? `/api/alerts?zone_id=${zoneId}` : '/api/alerts';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (err) {
        setError('Failed to load alerts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('alerts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newAlert = payload.new as Alert;
            if (!zoneId || newAlert.zone_id === zoneId) {
              setAlerts(prev => [newAlert, ...prev]);
              toast.success('New alert received!');
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedAlert = payload.old as Alert;
            setAlerts(prev => prev.filter(alert => alert.id !== deletedAlert.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedAlert = payload.new as Alert;
            setAlerts(prev =>
              prev.map(alert =>
                alert.id === updatedAlert.id ? updatedAlert : alert
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [zoneId]);

  if (isLoading) {
    return <Text>Loading alerts...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (alerts.length === 0) {
    return <Text>No alerts found</Text>;
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="p-4">
          <div className="flex items-center justify-between">
            <Title>{alert.title}</Title>
            <Badge
              color={
                alert.priority === 'high'
                  ? 'red'
                  : alert.priority === 'medium'
                  ? 'yellow'
                  : 'blue'
              }
            >
              {alert.priority}
            </Badge>
          </div>
          <Text className="mt-2">{alert.content}</Text>
          <Text className="text-sm text-gray-500 mt-2">
            {new Date(alert.created_at).toLocaleString()}
          </Text>
        </Card>
      ))}
    </div>
  );
} 