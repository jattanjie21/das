import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const ZoneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  coordinates: z.array(z.tuple([z.number(), z.number()])),
});

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const json = await request.json();
    const validatedData = ZoneSchema.parse(json);

    const { data, error } = await supabase
      .from('zones')
      .insert([validatedData])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create zone' },
      { status: 400 }
    );
  }
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data, error } = await supabase
      .from('zones')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch zones' },
      { status: 500 }
    );
  }
} 