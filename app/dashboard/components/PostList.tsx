'use client';

import Link from 'next/link';
import { createClient } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts: initialPosts }: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      setMessage(`Error deleting post: ${error.message}`);
      console.error('Error deleting post:', error.message);
    } else {
      // Update the state to remove the deleted post
      setPosts(posts.filter((post) => post.id !== postId));
      setMessage('Post deleted successfully!');
      router.refresh(); // Refresh the page to reflect changes
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {message && (
        <div className={`p-3 rounded-md text-center ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex-grow mb-4 md:mb-0">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 line-clamp-2">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/edit/${post.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(post.id)}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
