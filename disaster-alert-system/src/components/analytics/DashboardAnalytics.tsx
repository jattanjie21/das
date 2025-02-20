'use client';

import { useState, useEffect } from 'react';
import { Card, Title, BarChart, DonutChart, Metric, Text, Grid, Col } from '@tremor/react';
import { supabase } from '@/lib/supabase/config';

interface AlertMetrics {
  total: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byZone: {
    name: string;
    count: number;
  }[];
  byMonth: {
    month: string;
    count: number;
  }[];
}

export const DashboardAnalytics = () => {
  const [metrics, setMetrics] = useState<AlertMetrics>({
    total: 0,
    byPriority: { low: 0, medium: 0, high: 0 },
    byZone: [],
    byMonth: []
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Fetch total alerts
        const { count } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true });

        // Fetch alerts by priority
        const { data: priorityData } = await supabase
          .from('alerts')
          .select('priority')
          .then(({ data }) => {
            const counts = { low: 0, medium: 0, high: 0 };
            data?.forEach(alert => counts[alert.priority as keyof typeof counts]++);
            return { data: counts };
          });

        // Fetch alerts by zone
        const { data: zoneData } = await supabase
          .from('alerts')
          .select(`
            zones (
              name
            ),
            count
          `)
          .group('zones.name');

        // Fetch alerts by month
        const { data: monthData } = await supabase
          .from('alerts')
          .select('created_at')
          .then(({ data }) => {
            const counts = new Map<string, number>();
            data?.forEach(alert => {
              const month = new Date(alert.created_at).toLocaleString('default', { month: 'long' });
              counts.set(month, (counts.get(month) || 0) + 1);
            });
            return {
              data: Array.from(counts.entries()).map(([month, count]) => ({
                month,
                count
              }))
            };
          });

        setMetrics({
          total: count || 0,
          byPriority: priorityData || { low: 0, medium: 0, high: 0 },
          byZone: zoneData?.map(d => ({ name: d.zones.name, count: d.count })) || [],
          byMonth: monthData || []
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        <Card>
          <Text>Total Alerts</Text>
          <Metric>{metrics.total}</Metric>
        </Card>
        <Card>
          <Text>High Priority Alerts</Text>
          <Metric>{metrics.byPriority.high}</Metric>
        </Card>
        <Card>
          <Text>Active Zones</Text>
          <Metric>{metrics.byZone.length}</Metric>
        </Card>
      </Grid>

      <Grid numItems={1} numItemsLg={2} className="gap-6">
        <Card>
          <Title>Alerts by Priority</Title>
          <DonutChart
            className="mt-6"
            data={[
              { name: 'High', value: metrics.byPriority.high },
              { name: 'Medium', value: metrics.byPriority.medium },
              { name: 'Low', value: metrics.byPriority.low },
            ]}
            category="value"
            index="name"
            colors={['red', 'yellow', 'green']}
          />
        </Card>

        <Card>
          <Title>Alerts by Month</Title>
          <BarChart
            className="mt-6"
            data={metrics.byMonth}
            index="month"
            categories={['count']}
            colors={['blue']}
          />
        </Card>
      </Grid>

      <Card>
        <Title>Alerts by Zone</Title>
        <BarChart
          className="mt-6"
          data={metrics.byZone}
          index="name"
          categories={['count']}
          colors={['purple']}
        />
      </Card>
    </div>
  );
}; 