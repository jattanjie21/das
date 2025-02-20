import Link from 'next/link';

export const metadata = {
  title: 'Unauthorized | Disaster Alert System',
  description: 'Unauthorized access page',
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600 mb-8">
            You do not have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 