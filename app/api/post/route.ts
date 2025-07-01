import { createClient } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

// Public API endpoint to get all posts
export async function GET() {
  const supabase = createClient();
  const { data: posts, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts for public API:', error.message);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }

  return NextResponse.json(posts, { status: 200 });
}
