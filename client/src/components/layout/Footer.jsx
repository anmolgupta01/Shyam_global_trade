import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#254F7E] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Shyam Global Trade</h3>
            <a 
              href="https://www.shyamglobaltrade.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-white transition-colors mb-4 block"
            >
              www.shyamglobaltrade.com
            </a>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 mb-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              >
                <span className="text-xs text-white font-medium">f</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              >
                <span className="text-xs text-white font-medium">in</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              >
                <span className="text-xs text-white font-medium">X</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              >
                <span className="text-xs text-white font-medium">ig</span>
              </a>
            </div>
            
            <p className="text-gray-300 text-sm">Copyright © 2025 shyamglobaltrade.com-All Rights Reserved.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-white transition-colors text-sm"
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  to="/aboutus" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-white transition-colors text-sm"
                >
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-white transition-colors text-sm"
                >
                  PRODUCTS
                </Link>
              </li>
              <li>
                <Link 
                  to="/contactus" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-white transition-colors text-sm"
                >
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Address */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Address</h4>
            <a 
              href="https://maps.google.com/?q=Dostpur,+Sultanpur,+Uttar+Pradesh,+India" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-white transition-colors mb-2 block"
            >
              Dostpur, Sultanpur (U.P.)
            </a>
            <div className="space-y-2 text-gray-200 text-sm">
              <p>Call Us: 
                <a href="tel:+919794226856" className="hover:text-white transition-colors ml-1">
                  9794226856
                </a>, 
                <a href="tel:+918318076180" className="hover:text-white transition-colors ml-1">
                  8318076180
                </a>
              </p>
              <p>Email: 
                <a href="mailto:getanmol.gupta@gmail.com" className="hover:text-white transition-colors ml-1">
                  info@shyamglobaltrade.com
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <Link 
            to="/admin" 
            className="text-gray-200 hover:text-white transition-colors text-sm"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
