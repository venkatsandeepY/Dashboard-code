import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1F1246] text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-purple-200 mb-4 md:mb-0">
            © 2024 ESQM (DLIFE) • All rights reserved
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-purple-200 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <span className="text-purple-400">•</span>
            <a href="#" className="text-purple-200 hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <span className="text-purple-400">•</span>
            <a href="#" className="text-purple-200 hover:text-white transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;