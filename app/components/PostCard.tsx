import Link from 'next/link';

interface PostCardProps {
  id: string;
  title: string;
  content: string; // Content will now be HTML string
  showLink?: boolean;
}

export default function PostCard({ id, title, content, showLink = true }: PostCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      {/* Render HTML content using dangerouslySetInnerHTML */}
      {/* We use a div and line-clamp to show a preview of the rich text */}
      <div
        className="text-gray-600 mb-4 line-clamp-3 quill-content-preview" // Added a class for potential custom styling if needed
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {showLink && (
        <Link href={`/posts/${id}`} className="text-blue-500 hover:underline font-medium">
          Read More
        </Link>
      )}
    </div>
  );
}

