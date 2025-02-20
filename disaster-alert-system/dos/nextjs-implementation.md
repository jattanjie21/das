# Next.js Disaster Alert System Implementation Guide

## Project Setup

### Step 1: Initialize Next.js Project
```bash

# Install additional dependencies
npm install @tremor/react
npm install zustand # For state management
npm install react-hot-toast # For notifications
npm install zod # For form validation
```

### Step 2: Project Structure
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── alerts/
│   │   │   └── page.tsx
│   │   ├── zones/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   └── alerts/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── alerts/
│   ├── maps/
│   └── ui/
├── lib/
│   ├── supabase/
│   ├── types/
│   └── utils/
└── store/
```

### Step 3: Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

## Implementation

### Step 1: Supabase Configuration

1. Create `src/lib/supabase/config.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

2. Create Supabase middleware (`src/middleware.ts`):
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### Step 2: Authentication Components

1. Create Login Form (`src/components/auth/LoginForm.tsx`):
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/config';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Password"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </form>
  );
};
```

### Step 3: Map Implementation

1. Create Map Component (`src/components/maps/MapView.tsx`):
```typescript
'use client';

import { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}

export const MapView = ({ 
  initialViewState = {
    longitude: -16.5780,
    latitude: 13.4432,
    zoom: 7
  }
}: MapViewProps) => {
  const [viewState, setViewState] = useState(initialViewState);

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '500px' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      <NavigationControl />
    </Map>
  );
};
```

### Step 4: Alert System Implementation

1. Create Alert Types (`src/lib/types/alert.ts`):
```typescript
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
```

2. Create Alert Form (`src/components/alerts/AlertForm.tsx`):
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/config';
import { toast } from 'react-hot-toast';

export const AlertForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('alerts')
      .insert([{ title, content, priority }]);

    if (error) {
      toast.error('Failed to create alert');
    } else {
      toast.success('Alert created successfully');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Alert Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Alert Content"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
        className="w-full p-2 border rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Create Alert
      </button>
    </form>
  );
};
```

### Step 5: Dashboard Implementation

1. Create Dashboard Layout (`src/app/(dashboard)/layout.tsx`):
```typescript
import { Sidebar } from '@/components/ui/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

2. Create Dashboard Page (`src/app/(dashboard)/page.tsx`):
```typescript
import { Suspense } from 'react';
import { AlertsList } from '@/components/alerts/AlertsList';
import { MapView } from '@/components/maps/MapView';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <AlertsList />
          </Suspense>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Map Overview</h2>
          <MapView />
        </div>
      </div>
    </div>
  );
}
```

### Step 6: API Routes

1. Create Alert API Route (`src/app/api/alerts/route.ts`):
```typescript
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { title, content, priority, zone_id } = await request.json();

    const { data, error } = await supabase
      .from('alerts')
      .insert([{ title, content, priority, zone_id }])
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
```

### Step 7: State Management with Zustand

1. Create Store (`src/store/alertStore.ts`):
```typescript
import { create } from 'zustand';
import { Alert } from '@/lib/types/alert';

interface AlertState {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ 
    alerts: [alert, ...state.alerts] 
  })),
}));
```

### Step 8: Database Schema (Supabase)

Run these SQL commands in Supabase SQL editor:

```sql
-- Create zones table
CREATE TABLE zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  coordinates JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL,
  zone_id UUID REFERENCES zones(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alert_logs table
CREATE TABLE alert_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alert_id UUID REFERENCES alerts(id),
  status TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Running the Application

1. Development:
```bash
npm run dev
```

2. Build:
```bash
npm run build
```

3. Production:
```bash
npm start
```

## Additional Considerations

1. Add proper error boundaries
2. Implement proper loading states
3. Add input validation using Zod
4. Add proper TypeScript types
5. Implement proper security measures
6. Add proper logging
7. Implement responsive design
8. Add proper tests

This implementation provides a modern, scalable structure for the disaster alert system. The Next.js application can be further enhanced with:

- Real-time updates using Supabase subscriptions
- Advanced map features like drawing polygons
- More sophisticated alert scheduling
- Analytics dashboard
- Multi-language support
- Advanced user roles and permissions
