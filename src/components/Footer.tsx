import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-400" />
              About Us
            </h3>
            <p className="text-gray-300 mb-4">We provide a free, secure online video compression service to help you reduce video file sizes while maintaining quality.</p>
            <p className="text-gray-400 text-sm">Compress videos for social media, email, or any other purpose quickly and easily.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-400" />
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-400" />
              Contact
            </h3>
            <p className="text-gray-300 mb-2">Questions or concerns? Contact us through our support channels.</p>
            <a 
              href="mailto:support@rsizevideo.com" 
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              support@rsizevideo.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Video Compressor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;