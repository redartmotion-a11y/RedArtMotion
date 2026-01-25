import React, { useState, useEffect } from 'react';
import { Menu, X, Play } from 'lucide-react';
import logo from 'figma:asset/81b1bd4720a35c1b1ae962b568c1d6eb74b7618f.png';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#processus', label: 'Process' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#about', label: 'Reviews' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="RedArtMotion Logo"
              className="w-10 h-10 object-contain transform group-hover:scale-110 transition-transform"
            />
            <span className="text-white text-xl tracking-tight">
              Red<span className="text-white">Art</span>Motion
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-zinc-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <a
              href="#contact"
              className="px-6 py-2.5 bg-white text-black rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-zinc-300 hover:text-white transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block px-6 py-2.5 bg-white text-black rounded-lg hover:bg-zinc-100 transition-colors text-center"
            >
              Book a Call
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}