import { createClient } from '@/app/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PostList from './components/PostList';
import PaginationControls from '@/app/components/PaginationControls'; // Import the pagination component

// Define how many posts per page for the dashboard
const DASHBOARD_POSTS_PER_PAGE = 5; // Slightly fewer for dashboard list view

interface DashboardPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If no user, redirect to login page
    return redirect('/auth/login');
  }

  // Determine current page from search params, default to 1
  const currentPage = parseInt(searchParams.page || '1', 10);
  const offset = (currentPage - 1) * DASHBOARD_POSTS_PER_PAGE;
  const limit = DASHBOARD_POSTS_PER_PAGE;

  // Fetch posts specific to the logged-in user with pagination and count
  const { data: posts, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' }) // Request exact count for pagination
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1); // Fetch posts within the range

  if (error) {
    console.error('Error fetching user posts:', error.message);
    return <div className="text-red-500 text-center">Failed to load your posts.</div>;
  }

  // Calculate total pages for dashboard posts
  const totalPosts = count || 0;
  const totalPages = Math.ceil(totalPosts / DASHBOARD_POSTS_PER_PAGE);

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Dashboard Anda</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Kelola postingan Anda di sini.</p>

      <div className="flex justify-center mb-8">
        <Link href="/dashboard/create" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 text-lg">
          Buat Postingan Baru
        </Link>
      </div>

      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-center text-gray-500 mt-8">Anda belum memiliki postingan. Buat yang pertama!</p>
      )}

      {/* Render pagination controls only if there's more than one page */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/dashboard"
        />
      )}
    </div>
  );
}

