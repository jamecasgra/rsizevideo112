import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';

const ProcessingEmail = () => {
  const location = useLocation();
  const { email, videoId } = location.state || {};

  if (!email || !videoId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-[#242938] rounded-lg shadow-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Invalid Request</h2>
          <p className="text-gray-300 mb-6">This page cannot be accessed directly.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-[#242938] rounded-lg shadow-xl p-8 text-center">
        <Mail className="w-16 h-16 text-blue-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Video Processing Started</h2>
        <div className="flex items-center justify-center mb-6">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mr-2" />
          <p className="text-gray-300">Processing your video...</p>
        </div>
        <div className="bg-[#1a1f2e] p-6 rounded-lg mb-8">
          <p className="text-gray-300 mb-4">
            We'll send you an email notification at:
          </p>
          <p className="text-blue-400 text-xl font-semibold mb-4">{email}</p>
          <p className="text-gray-400 text-sm">
            You can close this window. We'll notify you when your video is ready.
          </p>
        </div>
        <div className="space-x-4">
          <Link
            to={`/download/${videoId}`}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Progress
          </Link>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProcessingEmail;