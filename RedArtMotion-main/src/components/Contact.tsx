import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Instagram, Mail, Send } from 'lucide-react';

export function Contact() {
  const handleWhatsApp = () => {
    const message = "Hello, I would like to organize a meeting to discuss a project.";
    const whatsappUrl = `https://wa.me/33754000142?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = () => {
    const subject = "Video Project - Quote Request";
    const body = "Hello,\n\nI would like to organize a meeting to discuss a project.\n\nBest regards,";
    window.location.href = `mailto:redartmotion@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleInstagram = () => {
    window.open('https://www.instagram.com/redart_motion/', '_blank');
  };



  return (
    <section id="contact" className="py-16 sm:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-4 text-sm sm:text-base">
            Ready to Start?
          </div>
          <h2 className="text-white mb-4 text-3xl sm:text-4xl">Contact Us</h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Choose your preferred contact method
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg hover:shadow-green-500/50"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Contact us on WhatsApp</span>
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Email Button */}
          <div className="text-center">
            <button
              onClick={handleEmail}
              className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg hover:shadow-blue-500/50"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Send us an email</span>
            </button>
            <p className="text-zinc-400 text-sm sm:text-base mt-3">
            </p>
          </div>

          {/* Instagram Button */}
          <button
            onClick={handleInstagram}
            className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg hover:shadow-purple-500/50"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Follow us on Instagram</span>
          </button>

          <p className="text-zinc-500 text-sm sm:text-base text-center mt-6">
            ⚡ Quick response guaranteed on all platforms
          </p>
        </motion.div>
      </div>
    </section>
  );
}