import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, FileVideo } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#1a1f2e]/80 backdrop-blur-sm text-white py-4 shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link to="/" className="flex items-center text-xl font-bold text-white hover:text-blue-400 transition-colors">
            <FileVideo className="w-6 h-6 mr-2 text-blue-500" />
            <span>Video Compressor</span>
          </Link>
        </div>
        
        <div className="sm:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} sm:block w-full sm:w-auto`}>
          <ul className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
            <li>
              <Link 
                to="/" 
                className="block py-1 text-gray-300 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/faq" 
                className="block py-1 text-gray-300 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy" 
                className="block py-1 text-gray-300 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link 
                to="/terms" 
                className="block py-1 text-gray-300 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;