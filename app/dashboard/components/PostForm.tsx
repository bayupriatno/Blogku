'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; // Import dynamic for client-side rendering

// Dynamically import ReactQuill to ensure it's only loaded on the client side
// This is necessary because ReactQuill uses browser-specific APIs (like document)
// that are not available during Next.js server-side rendering.
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
  };
}

export default function PostForm({ initialData }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  // Initialize content with initialData.content or an empty string for the editor
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage('Error: User not authenticated.');
      setLoading(false);
      return;
    }

    let error = null;

    if (initialData) {
      // Update existing post
      const { error: updateError } = await supabase
        .from('posts')
        .update({ title, content }) // content now contains HTML from Quill
        .eq('id', initialData.id)
        .eq('user_id', user.id); // Ensure user can only update their own posts
      error = updateError;
    } else {
      // Create new post
      const { error: insertError } = await supabase
        .from('posts')
        .insert({ title, content, user_id: user.id }); // content now contains HTML from Quill
      error = insertError;
    }

    if (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Post form error:', error.message);
    } else {
      setMessage(`Post ${initialData ? 'updated' : 'created'} successfully!`);
      router.push('/dashboard'); // Redirect to dashboard after success
      router.refresh(); // Refresh data on dashboard
    }
    setLoading(false);
  };

  // Define Quill modules (toolbar options)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Define Quill formats (allowed HTML tags)
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {initialData ? 'Edit Postingan' : 'Buat Postingan Baru'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">
            Judul
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan judul postingan Anda"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 text-sm font-semibold mb-2">
            Konten
          </label>
          {/* ReactQuill replaces the textarea */}
          <ReactQuill
            theme="snow" // Use 'snow' theme for a clean look
            value={content}
            onChange={setContent} // Quill passes the HTML content directly
            modules={modules}
            formats={formats}
            className="bg-white rounded-md border border-gray-300 min-h-[200px]" // Add some styling
            placeholder="Tulis konten postingan Anda di sini..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300 disabled:opacity-50 text-lg"
        >
          {loading ? 'Loading...' : (initialData ? 'Update Postingan' : 'Buat Postingan')}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

