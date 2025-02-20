import { Suspense } from 'react';
import { DashboardAnalytics } from '@/components/analytics/DashboardAnalytics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata = {
  title: 'Analytics | Disaster Alert System',
  description: 'Analytics dashboard for the Disaster Alert System',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DashboardAnalytics />
      </Suspense>
    </div>
  );
} 