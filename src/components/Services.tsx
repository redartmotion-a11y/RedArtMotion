import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Wand2, Film, Palette, FileText, Sparkles, Check, X, Instagram, Mail, MessageCircle, Send } from 'lucide-react';

export function Services() {
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState<number | null>(null);
  const [hoveredPackageIndex, setHoveredPackageIndex] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Your contact information
  const contactInfo = {
    instagram: "https://www.instagram.com/redart.vfx/",
    email: "redartmotion@gmail.com",
    whatsapp: "+33754000142"
  };

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
      autoMessages: {
        instagram: "Bonjour RedArt Motion! 👋 Je suis intéressé par votre package Vidéo Courte (30-60 secondes). Pouvez-vous me donner plus d'informations?",
        email: {
          subject: "Demande de devis - Package Vidéo Courte",
          body: `Bonjour RedArt Motion,\n\nJe suis intéressé par votre package Vidéo Courte (30-60 secondes).\n\nPouvez-vous me fournir plus d'informations et un devis détaillé?\n\nCordialement,\n[Votre Nom]`
        },
        whatsapp: "Bonjour RedArtMotion! Je suis intéressé par votre package Vidéo Courte (30-60 secondes). Pouvez-vous m'en dire plus?"
      }
    },
    {
      id: 2,
      name: 'Vidéo Standard',
      duration: '5-10 minutes',
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
      autoMessages: {
        instagram: "Bonjour RedArt Motion! 🎬 Je souhaite commander le package Vidéo Standard (5-10 minutes) pour mon projet. Quelle est la procédure?",
        email: {
          subject: "Commande - Package Vidéo Standard RedArt Motion",
          body: `Bonjour RedArt Motion,\n\nJe souhaite commander votre package Vidéo Standard (5-10 minutes) pour mon projet.\n\nJ'aimerais connaître:\n- Les disponibilités\n- Le processus de travail\n- Les modalités de paiement\n\nMon projet concerne: [Décrivez brièvement votre projet]\n\nMerci pour votre retour!\n\nCordialement,\n[Votre Nom]`
        },
        whatsapp: "Bonjour RedArt Motion! 🎬 Je veux commander le package Vidéo Standard (5-10 minutes). Pouvez-vous me guider pour la suite?"
      }
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
      autoMessages: {
        instagram: "Bonjour RedArt Motion! J'ai un projet important et je suis intéressé par votre package Vidéo Premium. Pouvons-nous discuter des détails?",
        email: {
          subject: "Projet Premium - Consultation RedArt Motion",
          body: `Bonjour RedArt Motion,\n\nJ'ai un projet vidéo important et je suis très intéressé par votre package Vidéo Premium.\n\nJe souhaiterais:\n- Une consultation détaillée\n- Un devis personnalisé\n- Discuter des délais et spécifications\n\nMon projet concerne: [Décrivez brièvement votre projet]\n\nDans l'attente de votre retour,\n\nCordialement,\n[Votre Nom]`
        },
        whatsapp: "Bonjour RedArt Motion! J'ai un projet sérieux et je veux le package Vidéo Premium. Disponible pour en parler?"
      }
    }
  ];

  const handlePackageSelect = (packageIndex: number) => {
    setSelectedPackage(packageIndex);
    setShowContactModal(true);
  };

  const getContactLinks = () => {
    if (selectedPackage === null) return null;

    const selectedPkg = packages[selectedPackage];
    const messages = selectedPkg.autoMessages;

    const encodedInstagramMessage = encodeURIComponent(messages.instagram);
    const encodedWhatsappMessage = encodeURIComponent(messages.whatsapp);
    const encodedEmailSubject = encodeURIComponent(messages.email.subject);
    const encodedEmailBody = encodeURIComponent(messages.email.body);

    return {
      instagram: `${contactInfo.instagram}?igshid=${Math.random().toString(36).substring(7)}`,
      email: `mailto:${contactInfo.email}?subject=${encodedEmailSubject}&body=${encodedEmailBody}`,
      whatsapp: `https://wa.me/${contactInfo.whatsapp.replace('+', '')}?text=${encodedWhatsappMessage}`
    };
  };

  const contactLinks = getContactLinks();

  return (
    <section id="services" className="py-16 sm:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredPackageIndex(index)}
              onMouseLeave={() => setHoveredPackageIndex(null)}
              className={`group relative p-8 rounded-xl border transition-all duration-500 {pkg.popular? 'bg-zinc-800/50 border-zinc-700 hover:border-white' : 'bg-zinc-900 border-zinc-800 hover:border-white'
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
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full transition-all duration-500">
                  Plus populaire
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-white mb-2 transition-colors duration-500">{pkg.name}</h4>
                <div className="text-zinc-400 mb-4 transition-colors duration-500">{pkg.duration}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-400 transition-colors duration-500">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5 transition-colors duration-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePackageSelect(index)}
                className={`block w-full py-3 rounded-lg text-center transition-all duration-500 ${pkg.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white'
                  }`}
              >
                Commander ce package
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && selectedPackage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl">
                  commander ce pack&nbsp;
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {packages[selectedPackage].name}
                  </span>
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-zinc-400 text-center text-4xl md:text-xl lg:text-xl font-bold mb-">
                via
              </p>

              <div className="space-y-4">
                {/* WhatsApp */}
                {contactLinks && (
                  <a
                    href={contactLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-emerald-900/30 border border-emerald-800 rounded-xl hover:bg-emerald-900/50 hover:border-emerald-700 transition-all group"
                  >
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        WhatsApp
                        <div className="mt-8 pt-6 border-t border-zinc-800">
                          <p className="text-zinc-500 text-sm text-center">
                            RedArt Motion vous répondra dans les 24 heures
                          </p>
                        </div>
                      </div>
                      <div className="text-emerald400 text-sm">
                      </div>
                    </div>
                    <Send className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                  </a>
                )}

                {/* Email */}
                {contactLinks && (
                  <a
                    href={contactLinks.email}
                    className="flex items-center gap-4 p-4 bg-blue-900/30 border border-blue-800 rounded-xl hover:bg-blue-900/50 hover:border-blue-700 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Email</div>
                      <div className="text-blue-300 text-sm">
                        Demande formelle avec tous les détails
                      </div>
                    </div>
                    <Send className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                  </a>
                )}

                {/* Instagram */}
                {contactLinks && (
                  <a
                    href={contactLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-pink-900/30 border border-pink-800 rounded-xl hover:bg-pink-900/50 hover:border-pink-700 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Instagram</div>
                      <div className="text-pink-300 text-sm">
                        Contact direct via messages privés
                      </div>
                    </div>
                    <Send className="w-5 h-5 text-pink-400 group-hover:text-pink-300" />
                  </a>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800">
                <p className="text-zinc-500 text-sm text-center">
                  RedArt Motion vous répondra dans les 24 heures
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}