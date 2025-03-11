import React from 'react';
import { FileText, UserCheck, Shield, Copyright, AlertTriangle, Bell, RefreshCw } from 'lucide-react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4 text-white">Terms of Service</h1>
        <p className="text-gray-400 text-lg">Please read these terms carefully before using our service</p>
      </div>
      
      <div className="space-y-8 text-gray-300">
        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <UserCheck className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">1. Acceptance of Terms</h2>
              <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">2. Service Description</h2>
              <p className="mb-3">We provide a free online video compression service. The service allows users to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload videos for compression</li>
                <li>Download compressed videos</li>
                <li>Reduce video file size while maintaining quality</li>
                <li>Receive email notifications when compression is complete (optional)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <AlertTriangle className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">3. User Obligations</h2>
              <p className="mb-3">Users must not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload copyrighted material without permission</li>
                <li>Upload illegal or prohibited content</li>
                <li>Attempt to manipulate or abuse the service</li>
                <li>Use automated means to access the service</li>
                <li>Click on advertisements without genuine interest</li>
                <li>Use the service to distribute malware or harmful content</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <Copyright className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">4. Intellectual Property</h2>
              <p>All content on this website, except user-uploaded videos, is the property of our service and is protected by copyright laws. Users retain all rights to their uploaded content.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">5. Limitation of Liability</h2>
              <p>We provide this service "as is" without any express or implied warranties. We are not responsible for any data loss or damages resulting from the use of our service. Users are advised to keep backup copies of their original videos.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <Bell className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">6. Advertising</h2>
              <p>Our service includes Google AdSense advertisements. Users must not click on ads without genuine interest or use any means to manipulate ad impressions or clicks.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#242938] rounded-lg p-6 shadow-md">
          <div className="flex items-start mb-4">
            <RefreshCw className="w-6 h-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">7. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. It is the user's responsibility to review these terms periodically.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;