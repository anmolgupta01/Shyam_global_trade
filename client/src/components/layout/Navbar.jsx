import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from "../../Assets/logo.png";

const navigationLinks = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/aboutus' },
  { name: 'Products', to: '/products' },
  { name: 'Contact us', to: '/contactus' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((o) => !o);

  const linkClass = ({ isActive }) =>
    `px-4 py-2 text-base font-medium transition-colors ${
      isActive
        ? 'bg-white/20 text-white rounded-md'
        : 'text-gray-200 hover:text-white hover:bg-white/10 rounded-md'
    }`;

  return (
    <nav className="bg-[#254F7E] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Increased height */}
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden bg-transparent">
              <img 
                src={logo} 
                alt="Shyam Global Trade Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-tight">
                Shyam Global Trade
              </span>
              <span className="text-sm text-gray-200 leading-tight">
                Exporting Trust, Tradition and Quality
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <NavLink key={link.name} to={link.to} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Link to="/contactus">
              <button className="bg-white text-[#254F7E] px-6 py-2 rounded-md text-base font-semibold shadow-sm hover:bg-gray-100 transition-colors">
                Book a Call
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-80 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          } overflow-hidden`}
        >
          <div className="px-3 pt-3 pb-4 space-y-2 bg-[#254F7E] border-t border-white/20">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `block w-full text-left px-4 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-2">
              <Link to="/contactus" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full bg-white text-[#254F7E] px-5 py-2 rounded-md text-base font-semibold shadow-sm hover:bg-gray-100 transition-colors">
                  Book a Call
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
