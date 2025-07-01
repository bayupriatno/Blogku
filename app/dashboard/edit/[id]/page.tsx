import PostForm from '@/app/dashboard/components/PostForm';
import { createClient } from '@/app/lib/supabase';
import { redirect } from 'next/navigation';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If no user, redirect to login page
    return redirect('/auth/login');
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id) // Ensure user can only edit their own posts
    .single();

  if (error || !post) {
    console.error('Error fetching post for edit or post not found/authorized:', error?.message);
    // Redirect to dashboard if post not found or not authorized
    return redirect('/dashboard');
  }

  return <PostForm initialData={post} />;
}
