'use client';

import { useState } from 'react';
import { Card, Title } from '@tremor/react';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertList } from '@/components/alerts/AlertList';

export default function AlertsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAlertCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-gray-600">Create and manage alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Title>Create New Alert</Title>
          <div className="mt-4">
            <AlertForm onSuccess={handleAlertCreated} />
          </div>
        </Card>

        <Card>
          <Title>Active Alerts</Title>
          <div className="mt-4">
            <AlertList key={refreshKey} />
          </div>
        </Card>
      </div>
    </div>
  );
} 