import React from 'react';
import { Play, Instagram, Mail } from 'lucide-react';
import logo from 'figma:asset/81b1bd4720a35c1b1ae962b568c1d6eb74b7618f.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Short Form', href: '#services' },
      { label: 'Motion Design', href: '#services' },
      { label: 'Explainer Videos', href: '#services' },
      { label: 'Color Grading', href: '#services' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Process', href: '#processus' },
      { label: 'Testimonials', href: '#testimonials' }
    ],
    support: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#contact' },
      { label: 'Free Quote', href: '#contact' },
      { label: 'Book a Call', href: '#contact' }
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/redart_motion/', label: 'Instagram' },
    { icon: Mail, href: 'mailto:redartmotion@gmail.com', label: 'Email' }
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="RedArtMotion Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-white text-xl">
                Red<span className="text-white">Art</span>Motion
              </span>
            </a>
            <p className="text-zinc-400 mb-6 max-w-xs text-sm sm:text-base">
              Video editing & motion design studio for content creators and innovative companies.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white mb-2">Stay informed</h4>
              <p className="text-zinc-400 text-sm">
                Receive our video tips and exclusive offers
              </p>
            </div>
            <form className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 md:w-64 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-white text-black rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <div>
              © {currentYear} RedArtMotion. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Legal Notice
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                T&C
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}