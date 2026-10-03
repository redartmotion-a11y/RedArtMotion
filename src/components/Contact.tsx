import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Instagram, Mail, Send } from 'lucide-react';

export function Contact() {
  const handleWhatsApp = () => {
    const message = "📩 Demande de rendez-vous - RedArtMotion\n\n💬 Message :\nBonjour, je souhaite organiser un rendez-vous pour discuter d'un projet.\n\n🔗 Instagram : https://www.instagram.com/redart.vfx/";
    const whatsappUrl = `https://wa.me/213550651047?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagram = () => {
    window.open('https://www.instagram.com/redart.vfx/', '_blank');
  };

  const handleEmail = () => {
    const subject = 'Demande de rendez-vous - RedArtMotion';
    const body = "Bonjour,\n\nJe souhaite organiser un rendez-vous pour discuter d'un projet.\n\nCordialement,";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=redartmotion@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
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
            Prêt à démarrer ?
          </div>
          <h2 className="text-white mb-4 text-3xl sm:text-4xl">Contactez-nous</h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Choisissez votre méthode de contact préférée
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
            <span>Nous contacter sur WhatsApp</span>
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Email Button */}
          <div className="text-center">
            <button
              onClick={handleEmail}
              className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg hover:shadow-blue-500/50"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Nous envoyer un email</span>
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
            <span>Nous suivre sur Instagram</span>
          </button>

          <p className="text-zinc-500 text-sm sm:text-base text-center mt-6">
            ⚡ Réponse rapide garantie sur toutes les plateformes
          </p>
        </motion.div>
      </div>
    </section>
  );
}