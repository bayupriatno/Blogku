import Link from 'next/link';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., '/dashboard' or '/'
}

export default function PaginationControls({ currentPage, totalPages, basePath }: PaginationControlsProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      {/* Previous Page Button */}
      <Link
        href={`${basePath}?page=${currentPage - 1}`}
        className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${
          hasPreviousPage
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
        }`}
        aria-disabled={!hasPreviousPage}
        tabIndex={hasPreviousPage ? 0 : -1}
      >
        Previous
      </Link>

      {/* Current Page Indicator */}
      <span className="text-lg font-medium text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Page Button */}
      <Link
        href={`${basePath}?page=${currentPage + 1}`}
        className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${
          hasNextPage
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
        }`}
        aria-disabled={!hasNextPage}
        tabIndex={hasNextPage ? 0 : -1}
      >
        Next
      </Link>
    </div>
  );
}

