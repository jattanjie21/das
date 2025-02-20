import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-12 md:pt-32 md:pb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Disaster Alert System
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive platform for managing and distributing emergency alerts efficiently and effectively.
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Real-time Alerts</h3>
            <p className="text-gray-600">
              Instantly notify affected areas with critical information during emergencies.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Zone Management</h3>
            <p className="text-gray-600">
              Define and manage geographical zones for targeted alert distribution.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600">
              Track and analyze alert effectiveness with comprehensive metrics.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our platform and help keep your community informed and safe.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create an Account
          </Link>
        </div>

        {/* Footer */}
        <footer className="py-8 border-t">
          <div className="text-center text-gray-600">
            <p>© 2024 Disaster Alert System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
