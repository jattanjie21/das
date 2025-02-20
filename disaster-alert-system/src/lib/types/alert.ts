export interface Alert {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  zone_id: string;
  created_at: string;
}

export interface Zone {
  id: string;
  name: string;
  coordinates: [number, number][];
} 