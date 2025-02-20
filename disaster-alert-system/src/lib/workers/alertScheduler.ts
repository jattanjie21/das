import { supabase } from '../supabase/config';
import { Alert } from '../types/alert';

const POLLING_INTERVAL = 60000; // 1 minute

async function processScheduledAlerts() {
  const now = new Date().toISOString();

  // Get pending alerts that are due
  const { data: dueAlerts, error: fetchError } = await supabase
    .from('scheduled_alerts')
    .select('*')
    .eq('status', 'pending')
    .lte('schedule_date', now)
    .order('schedule_date', { ascending: true });

  if (fetchError) {
    console.error('Error fetching scheduled alerts:', fetchError);
    return;
  }

  for (const alert of dueAlerts || []) {
    try {
      // Create the actual alert
      const { error: insertError } = await supabase
        .from('alerts')
        .insert([{
          title: alert.title,
          content: alert.content,
          priority: alert.priority,
          zone_id: alert.zone_id,
        }]);

      if (insertError) throw insertError;

      // Update the scheduled alert
      const updates: Record<string, any> = {
        last_run_at: now,
      };

      if (alert.recurring) {
        updates.status = 'pending';
        // next_run_at will be updated by the trigger
      } else {
        updates.status = 'completed';
      }

      const { error: updateError } = await supabase
        .from('scheduled_alerts')
        .update(updates)
        .eq('id', alert.id);

      if (updateError) throw updateError;

    } catch (error) {
      console.error(`Error processing alert ${alert.id}:`, error);
      
      // Mark as failed
      await supabase
        .from('scheduled_alerts')
        .update({ 
          status: 'failed',
          last_run_at: now 
        })
        .eq('id', alert.id);
    }
  }
}

export function startAlertScheduler() {
  // Initial run
  processScheduledAlerts();

  // Set up polling interval
  const intervalId = setInterval(processScheduledAlerts, POLLING_INTERVAL);

  // Return cleanup function
  return () => clearInterval(intervalId);
} 