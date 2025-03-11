import React from 'react';
import { Shield, Lock, Database, Bell, RefreshCw, AlertTriangle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
        <p className="text-gray-400 text-lg">How we handle and protect your data</p>
      </div>
      
      <div className="space-y-8 text-gray-300">
        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <Database className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">1. Information We Collect</h2>
              <p className="mb-3">When you use our video compression service, we collect:</p>
              <ul className="list-disc pl-6 mb-3 space-y-2">
                <li>Uploaded video files (temporarily)</li>
                <li>Basic usage statistics</li>
                <li>Technical information about your browser and device</li>
                <li>Email address (only if you opt-in for email notifications)</li>
              </ul>
              <p>We do not store your videos permanently. All files are automatically deleted after 24 hours.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <RefreshCw className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">2. How We Use Your Information</h2>
              <p className="mb-3">We use the collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide video compression services</li>
                <li>Send email notifications about completed compressions (if requested)</li>
                <li>Improve our service</li>
                <li>Maintain and monitor service performance</li>
                <li>Prevent abuse of our service</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <Lock className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">3. Data Security</h2>
              <p>We implement appropriate security measures to protect your data during transmission and processing. Your videos are processed securely and deleted after 24 hours. Email addresses are stored securely and only used for the purpose of sending compression notifications.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <Bell className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">4. Advertising</h2>
              <p className="mb-3">We use Google AdSense on our website. Google AdSense may use cookies and similar technologies to serve personalized ads. For more information about Google's privacy practices, please visit the Google Privacy & Terms page.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <AlertTriangle className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">5. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">6. Contact Us</h2>
              <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:support@rsizevideo.com" className="text-blue-400 hover:underline">support@rsizevideo.com</a>.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;