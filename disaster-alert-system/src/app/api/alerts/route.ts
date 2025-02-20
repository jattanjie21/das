import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const AlertSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high']),
  zone_id: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const json = await request.json();
    const validatedData = AlertSchema.parse(json);

    const { data, error } = await supabase
      .from('alerts')
      .insert([validatedData])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create alert' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const zone_id = searchParams.get('zone_id');
  
  try {
    let query = supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (zone_id) {
      query = query.eq('zone_id', zone_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
} 