import { Suspense } from 'react';
import { MapView } from '@/components/maps/MapView';
import { Card, Title, Text } from '@tremor/react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Monitor alerts and zones in real-time</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Title>Active Alerts</Title>
          <Suspense fallback={<Text>Loading alerts...</Text>}>
            {/* AlertsList component will be added later */}
            <div className="h-64 flex items-center justify-center">
              <Text>No active alerts</Text>
            </div>
          </Suspense>
        </Card>
        
        <Card>
          <Title>Map Overview</Title>
          <div className="h-64">
            <MapView />
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <Title>Total Zones</Title>
          <div className="mt-4">
            <Text>0 zones defined</Text>
          </div>
        </Card>
        
        <Card>
          <Title>Recent Activity</Title>
          <div className="mt-4">
            <Text>No recent activity</Text>
          </div>
        </Card>
        
        <Card>
          <Title>System Status</Title>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Text>All systems operational</Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 