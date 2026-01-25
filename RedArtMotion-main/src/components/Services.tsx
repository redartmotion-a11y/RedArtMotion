import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Wand2, Film, Palette, FileText, Sparkles, Check, X, MessageCircle, Mail, Instagram } from 'lucide-react';

export function Services() {
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState<number | null>(null);
  const [hoveredPackageIndex, setHoveredPackageIndex] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<{ name: string, duration: string, features: string[] } | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const services = [
    {
      icon: Video,
      title: 'Short Form',
      description: 'Precise and dynamic editing to bring your content to life',
      features: ['Cuts & transitions', 'Audio synchronization', 'Pace optimization', 'Multi-format export']
    },
    {
      icon: Wand2,
      title: 'Motion Design',
      description: 'Impactful graphic animations for your explainer videos',
      features: ['2D/3D Animations', 'Animated typography', 'Infographics', 'Logo animation']
    },
    {
      icon: Film,
      title: 'Explainer Videos',
      description: 'Transform your complex ideas into clear and engaging videos',
      features: ['Storyboarding', 'Script & voice-over', 'Illustrations', 'Call to action']
    },
    {
      icon: Palette,
      title: 'Color Grading',
      description: 'Professional color grading for a unique visual ambiance',
      features: ['Color correction', 'Custom LUTs', 'Visual consistency', 'Image retouching']
    },
    {
      icon: FileText,
      title: 'Storyboarding',
      description: 'Visual design of your project before production',
      features: ['Scriptwriting', 'Scene sketching', 'Sequencing', 'Concept validation']
    },
    {
      icon: Sparkles,
      title: 'Audio Mixing',
      description: 'Mixing and mastering for professional sound',
      features: ['Audio cleanup', 'Equalization', 'Music & SFX', 'Mixed voice-over']
    }
  ];

  const packages = [
    {
      id: 1,
      name: 'Short-Form Video',
      duration: '30-60 seconds',
      features: [
        'Professional editing',
        'Motion design',
        'Color grading',
        'Audio mixing',
        'Unlimited revisions',
        'Custom illustration',
        'Unique branding',
        'Viral effects/Motions'
      ],
      popular: false,
      premium: false
    },
    {
      id: 2,
      name: 'Standard Video',
      duration: '1-3 minutes',
      features: [
        'Advanced editing',
        'Pro motion design',
        'Premium color grading',
        'Pro audio mixing',
        'Storyboard included',
        'Unlimited revisions',
        'Style (Iman Gadzhi, Alex Hormozi)',
        'Subtitles included'
      ],
      popular: true,
      premium: false
    },
    {
      id: 3,
      name: 'Premium Video',
      duration: '5-10 minutes and more',
      features: [
        'Everything in Standard',
        '3D Animations',
        'Advanced storytelling',
        'Sound Design & Mixing',
        'Unlimited revisions',
        'Custom branding',
        'Pro color grading',
        'Documentary style (optional)'
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
      'Short-Form Video': `Hello! I'm interested in the "Short-Form Video" package (30-60 seconds). Could you send me more information and a personalized quote?`,
      'Standard Video': `Hello! I would like to order the "Standard Video" package (1-3 minutes). Could you prepare a detailed quote for me?`,
      'Premium Video': `Hello! I'm interested in the "Premium Video" package (5-10 minutes and more). I'd like to discuss the available options and get a quote.`
    };
    return encodeURIComponent(messages[pkgName as keyof typeof messages] || 'Hello, I would like to organize a meeting to discuss a project.');
  };

  const contactOptions = [
    {
      icon: MessageCircle,
      name: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      href: (pkgName: string) => `https://wa.me/33754000142?text=${getPackageMessage(pkgName)}`
    },
    {
      icon: Mail,
      name: 'Email',
      color: 'bg-blue-500 hover:bg-blue-600',
      href: (pkgName: string) => `mailto:redartmotion@gmail.com?subject=Quote Request - ${pkgName}&body=${getPackageMessage(pkgName)}`
    },
    {
      icon: Instagram,
      name: 'Instagram',
      color: 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600',
      href: (_pkgName?: string) => 'https://www.instagram.com/redart_motion/'
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
                        <h3 className="text-white text-xl font-semibold">Order this package</h3>
                        <p className="text-zinc-400 text-sm mt-1">Contact us to get your quote</p>
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
                      </div>
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="p-6">
                    <p className="text-zinc-400 text-center mb-6">
                      Choose your preferred contact method
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
                                ? 'Contact us via direct message'
                                : 'Pre-filled message for your request'}
                            </p>
                          </div>
                        </motion.a>
                      ))}
                    </div>

                    {/* Alternative */}
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      <p className="text-center text-zinc-500 text-sm">
                        Prefer to discuss your project first?<br />
                        <a href="#contact" className="text-purple-400 hover:text-purple-300 transition-colors">
                          Use our contact form
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
            Our Services
          </div>
          <h2 className="text-white mb-4">
            Complete Video Production Expertise
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            From concept to delivery, we handle all aspects
            of your video project
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
          <h3 className="text-white mb-4">Packages & Pricing</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Choose the package that fits your project. Personalized rates according to your needs.
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
              className={`group relative p-8 rounded-xl border transition-all duration-500 ${pkg.premium
                ? 'bg-gradient-to-br from-yellow-900/20 via-amber-900/10 to-yellow-800/20 border-yellow-600/50 hover:border-yellow-500 shadow-lg shadow-yellow-900/20'
                : pkg.popular
                  ? 'bg-gradient-to-br from-purple-900/20 via-zinc-900 to-purple-800/20 border-purple-500/50 hover:border-purple-400 shadow-lg shadow-purple-900/20'
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
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className={`mb-2 transition-colors duration-500 ${pkg.premium
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400'
                  : pkg.popular
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'
                    : 'text-white'
                  }`}>{pkg.name}</h4>
                <div className={`mb-4 transition-colors duration-500 ${pkg.premium
                  ? 'text-yellow-300/80'
                  : pkg.popular
                    ? 'text-purple-300/80'
                    : 'text-zinc-400'
                  }`}>{pkg.duration}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 transition-colors duration-500 ${pkg.premium
                    ? 'text-yellow-100/90'
                    : pkg.popular
                      ? 'text-white'
                      : 'text-zinc-400'
                    }`}>
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors duration-500 ${pkg.premium
                      ? 'text-yellow-500'
                      : 'text-purple-500'
                      }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePackageClick(pkg)}
                className={`block w-full py-3 rounded-lg text-center transition-all duration-500 ${pkg.premium
                  ? 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 text-black font-semibold hover:from-yellow-500 hover:via-amber-400 hover:to-yellow-500 shadow-lg shadow-yellow-600/50 hover:shadow-yellow-500/70'
                  : pkg.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white'
                  }`}
              >
                {pkg.premium ? 'Premium Consultation' : 'Request a Quote'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}