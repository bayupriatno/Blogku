import PostForm from '@/app/dashboard/components/PostForm';
import { createClient } from '@/app/lib/supabase';
import { redirect } from 'next/navigation';

export default async function CreatePostPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If no user, redirect to login page
    return redirect('/auth/login');
  }

  return <PostForm />;
}
