import { createClient } from '@/app/lib/supabase';
import PostCard from './components/PostCard';
import PaginationControls from './components/PaginationControls';

// Define how many posts per page
const POSTS_PER_PAGE = 6;

interface HomePageProps {
  searchParams: {
    page?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = createClient();

  // Determine current page from search params, default to 1
  const currentPage = parseInt(searchParams.page || '1', 10);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const limit = POSTS_PER_PAGE;

  // Fetch posts with pagination and get the total count
  const { data: posts, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' }) // Request exact count for pagination
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1); // Fetch posts within the range

  if (error) {
    console.error('Error fetching posts:', error.message);
    return <div className="text-red-500 text-center">Failed to load posts.</div>;
  }

  // Calculate total pages
  const totalPosts = count || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Selamat Datang di LogikaLokal</h1>
      <p className="text-lg text-gray-600 mb-10 text-center">Jelajahi berbagai postingan menarik dari komunitas kami.</p>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} id={post.id} title={post.title} content={post.content} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">Belum ada postingan. Jadilah yang pertama membuat!</p>
      )}

      {/* Render pagination controls only if there's more than one page */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/"
        />
      )}
    </div>
  );
}

