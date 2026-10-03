 import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Wand2, Film, Palette, FileText, Sparkles, Check, X, MessageCircle, Mail, Instagram } from 'lucide-react';

export function Services() {
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState<number | null>(null);
  const [hoveredPackageIndex, setHoveredPackageIndex] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<{name: string, duration: string, features: string[]} | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const services = [
    {
      icon: Video,
      title: 'Montage Vidéo Pro',
      description: 'Montage précis et dynamique pour donner vie à vos contenus',
      features: ['Cuts & transitions', 'Synchronisation audio', 'Optimisation rythme', 'Export multi-formats']
    },
    {
      icon: Wand2,
      title: 'Motion Design',
      description: 'Animations graphiques percutantes pour vos vidéos explicatives',
      features: ['Animations 2D/3D', 'Typographie animée', 'Infographies', 'Logo animation']
    },
    {
      icon: Film,
      title: 'Vidéos Explicatives',
      description: 'Transformez vos idées complexes en vidéos claires et engageantes',
      features: ['Storyboard', 'Script & voix-off', 'Illustrations', 'Call-to-action']
    },
    {
      icon: Palette,
      title: 'Color Grading',
      description: 'Étalonnage professionnel pour une ambiance visuelle unique',
      features: ['Correction couleur', 'LUTs personnalisées', 'Cohérence visuelle', 'Retouche image']
    },
    {
      icon: FileText,
      title: 'Storyboard',
      description: 'Conception visuelle de votre projet avant production',
      features: ['Scénarisation', 'Croquis scènes', 'Séquençage', 'Validation concept']
    },
    {
      icon: Sparkles,
      title: 'Mixage Audio',
      description: 'Mixage et mastering pour un son professionnel',
      features: ['Nettoyage audio', 'Equalisation', 'Musique & SFX', 'Voix-off mixée']
    }
  ];

  const packages = [
    {
      id: 1,
      name: 'Vidéo Courte',
      duration: '30-60 secondes',
       features: [
        'Montage professionnel',
        'Motion design ',
        'Color grading',
        'Mixage audio',
        'révisions ilimité',
        'ilustration personaliser',
        'unique branding ',
        'virals effects/motions',        
      ],
      popular: false,
      premium: false
    },
    {
      id: 2,
      name: 'Vidéo Standard',
      duration: '1-3 minutes',
       features: [
        'Montage avancé',
        'Motion design pro',
        'Color grading premium',
        'Mixage audio pro',
        'Storyboard inclus',
        'révisions ilimité',
        'style comme(iman gadzhi,alex hermozie)',
        'Sous-titres inclus'
      ],
      popular: true,
      premium: false
    },
    {
      id: 3,
      name: 'Vidéo Premium',
      duration: '5-10 minutes et plus',
       features: [
        'Tout du package Standard',
        'Animations 3D',
        'advanced storytelling',
        'Sound design/mixing',
        'Révisions illimitées',
        'branding personalisé',
        'color grading pro',
        'documentary style (optional)'
      ],
      popular: false,
      premium: true
    }
  ];

  const handlePackageClick = (pkg: any) => {
    setSelectedPackage({
      name: pkg.name,
      duration: pkg.duration,
      features: pkg.features
    });
    setShowContactModal(true);
  };

  const getPackageMessage = (pkgName: string) => {
    const messages = {
      'Vidéo Courte': `Bonjour ! Je suis intéressé(e) par le package "Vidéo Courte" (30-60 secondes). Pourriez-vous m'envoyer plus d'informations et un devis personnalisé ?`,
      'Vidéo Standard': `Bonjour ! Je souhaite commander le package "Vidéo Standard" (1-3 minutes). Pourriez-vous me préparer un devis détaillé ?`,
      'Vidéo Premium': `Bonjour ! Je suis intéressé(e) par le package "Vidéo Premium" (5-10 minutes et plus). J'aimerais discuter des options disponibles et obtenir un devis.`
    };
    return encodeURIComponent(messages[pkgName as keyof typeof messages] || 'Bonjour ! Je suis intéressé(e) par vos services vidéo.');
  };

  const contactOptions = [
    {
      icon: MessageCircle,
      name: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      href: (pkgName: string) => `https://wa.me/33600000000?text=${getPackageMessage(pkgName)}`
    },
    {
      icon: Mail,
      name: 'Email',
      color: 'bg-blue-500 hover:bg-blue-600',
      href: (pkgName: string) => `mailto:contact@example.com?subject=Demande de devis - ${pkgName}&body=${getPackageMessage(pkgName)}`
    },
    {
      icon: Instagram,
      name: 'Instagram',
      color: 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600',
      href: () => 'https://instagram.com/yourprofile'
    }
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Contact Modal */}
        <AnimatePresence>
          {showContactModal && selectedPackage && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowContactModal(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-white text-xl font-semibold">Commander ce package</h3>
                        <p className="text-zinc-400 text-sm mt-1">Contactez-nous pour obtenir votre devis</p>
                      </div>
                      <button
                        onClick={() => setShowContactModal(false)}
                        className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Package Info */}
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{selectedPackage.name}</h4>
                          <p className="text-zinc-400 text-sm">{selectedPackage.duration}</p>
                        </div>
                        <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm">
                          Sur devis
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="p-6">
                    <p className="text-zinc-400 text-center mb-6">
                      Choisissez votre mode de contact préféré
                    </p>
                    
                    <div className="space-y-3">
                      {contactOptions.map((option, index) => (
                        <motion.a
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          href={option.href(selectedPackage.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (option.name === 'Instagram') {
                              // Instagram doesn't support pre-filled messages
                              setShowContactModal(false);
                            }
                          }}
                          className={`flex items-center gap-4 p-4 rounded-xl text-white transition-all duration-300 hover:scale-[1.02] ${option.color}`}
                        >
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <option.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="font-medium">{option.name}</span>
                            <p className="text-sm opacity-90">
                              {option.name === 'Instagram' 
                                ? 'Contactez-nous en message privé' 
                                : 'Message pré-rempli pour votre demande'}
                            </p>
                          </div>
                        </motion.a>
                      ))}
                    </div>

                    {/* Alternative */}
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      <p className="text-center text-zinc-500 text-sm">
                        Vous préférez d'abord discuter de votre projet ?<br />
                        <a href="#contact" className="text-purple-400 hover:text-purple-300 transition-colors">
                          Utilisez notre formulaire de contact
                        </a>
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-4">
            Nos Services
          </div>
          <h2 className="text-white mb-4">
            Expertise complète en production vidéo
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            De la conception à la livraison, nous prenons en charge tous les aspects 
            de votre projet vidéo
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredServiceIndex(index)}
              onMouseLeave={() => setHoveredServiceIndex(null)}
              className="group p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-white transition-all duration-500 hover:bg-zinc-800/50"
              style={{
                filter: hoveredServiceIndex === null 
                  ? 'grayscale(100%)' 
                  : hoveredServiceIndex === index 
                    ? 'grayscale(0%) blur(0px)' 
                    : 'grayscale(100%) blur(2px)',
                opacity: hoveredServiceIndex === null 
                  ? 1 
                  : hoveredServiceIndex === index 
                    ? 1 
                    : 0.4,
                transform: hoveredServiceIndex === index ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 transition-all duration-500">
                <service.icon className="w-6 h-6 text-white transition-colors duration-500" />
              </div>
              <h3 className="text-white mb-2 transition-colors duration-500">{service.title}</h3>
              <p className="text-zinc-400 mb-4 transition-colors duration-500">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-zinc-500 text-sm transition-colors duration-500">
                    <div className="w-1 h-1 bg-purple-500 rounded-full transition-colors duration-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Packages Section */}
        <div className="text-center mb-12">
          <h3 className="text-white mb-4">Packages & Tarifs</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Choisissez la formule adaptée à votre projet. Tarifs personnalisés selon vos besoins.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredPackageIndex(index)}
              onMouseLeave={() => setHoveredPackageIndex(null)}
              className={`group relative p-8 rounded-xl border transition-all duration-500 ${
                pkg.premium
                  ? 'bg-gradient-to-br from-yellow-900/20 via-amber-900/10 to-yellow-800/20 border-yellow-600/50 hover:border-yellow-500 shadow-lg shadow-yellow-900/20'
                  : pkg.popular
                    ? 'bg-zinc-800/50 border-zinc-700 hover:border-white'
                    : 'bg-zinc-900 border-zinc-800 hover:border-white'
              }`}
              style={{
                filter: hoveredPackageIndex === null 
                  ? 'grayscale(100%)' 
                  : hoveredPackageIndex === index 
                    ? 'grayscale(0%) blur(0px)' 
                    : 'grayscale(100%) blur(2px)',
                opacity: hoveredPackageIndex === null 
                  ? 1 
                  : hoveredPackageIndex === index 
                    ? 1 
                    : 0.4,
                transform: hoveredPackageIndex === index ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Premium Badge */}
              {pkg.premium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 text-black rounded-full transition-all duration-500 shadow-lg shadow-yellow-500/50 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold">Premium Gold</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              
              {/* Popular Badge */}
              {pkg.popular && !pkg.premium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full transition-all duration-500">
                  Plus populaire
                </div>
              )}
              
              <div className="text-center mb-6">
                <h4 className={`mb-2 transition-colors duration-500 ${
                  pkg.premium ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400' : 'text-white'
                }`}>{pkg.name}</h4>
                <div className={`mb-4 transition-colors duration-500 ${
                  pkg.premium ? 'text-yellow-300/80' : 'text-zinc-400'
                }`}>{pkg.duration}</div>
                <div className={`text-3xl bg-clip-text text-transparent transition-colors duration-500 ${
                  pkg.premium 
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>{pkg.price}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 transition-colors duration-500 ${
                    pkg.premium ? 'text-yellow-100/90' : 'text-zinc-400'
                  }`}>
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors duration-500 ${
                      pkg.premium ? 'text-yellow-500' : 'text-purple-500'
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePackageClick(pkg)}
                className={`block w-full py-3 rounded-lg text-center transition-all duration-500 ${
                  pkg.premium
                    ? 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 text-black font-semibold hover:from-yellow-500 hover:via-amber-400 hover:to-yellow-500 shadow-lg shadow-yellow-600/50 hover:shadow-yellow-500/70'
                    : pkg.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white'
                }`}
              >
                {pkg.premium ? 'Consultation Premium' : 'Demander un devis'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}