'use client';

import { useState } from 'react';
import { Card, Title, Text, Button, TextInput } from '@tremor/react';
import { MapView } from '@/components/maps/MapView';
import { DrawControl } from '@/components/maps/DrawControl';
import { toast } from 'react-hot-toast';

export default function ZonesPage() {
  const [zoneName, setZoneName] = useState('');
  const [zoneDescription, setZoneDescription] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  const handleCreate = async (evt: { features: any[] }) => {
    const [feature] = evt.features;
    if (feature.geometry.type === 'Polygon') {
      setCoordinates(feature.geometry.coordinates[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zoneName) {
      toast.error('Please enter a zone name');
      return;
    }

    if (coordinates.length < 3) {
      toast.error('Please draw a valid polygon on the map');
      return;
    }

    try {
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: zoneName,
          description: zoneDescription,
          coordinates,
        }),
      });

      if (!response.ok) throw new Error('Failed to create zone');

      toast.success('Zone created successfully');
      setZoneName('');
      setZoneDescription('');
      setCoordinates([]);
    } catch (error) {
      toast.error('Failed to create zone');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Zones</h1>
        <p className="text-gray-600">Create and manage alert zones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Title>Create New Zone</Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <Text>Zone Name</Text>
              <TextInput
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="Enter zone name"
              />
            </div>
            <div>
              <Text>Description</Text>
              <TextInput
                value={zoneDescription}
                onChange={(e) => setZoneDescription(e.target.value)}
                placeholder="Enter zone description"
              />
            </div>
            <Text>Draw Zone on Map</Text>
            <div className="h-64 border rounded-lg overflow-hidden">
              <MapView>
                <DrawControl
                  position="top-left"
                  onCreate={handleCreate}
                  onUpdate={(e) => handleCreate(e)}
                />
              </MapView>
            </div>
            <Button type="submit" color="blue">
              Create Zone
            </Button>
          </form>
        </Card>

        <Card>
          <Title>Existing Zones</Title>
          <div className="mt-4">
            <Text>No zones defined yet</Text>
          </div>
        </Card>
      </div>
    </div>
  );
} 