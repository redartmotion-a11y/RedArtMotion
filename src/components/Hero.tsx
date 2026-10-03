 import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI3MjcyNyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Studio de montage vidéo & motion design</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-white mb-4 sm:mb-6 max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-6xl">
            Transformez vos idées en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300">
              vidéos percutantes
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
            Montage vidéo professionnel, motion design & vidéos explicatives pour SaaS, 
            Coaches, YouTubeurs et Content Creators qui veulent captiver leur audience
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
            <a
              href="#contact"
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-lg hover:bg-zinc-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-white/20 hover:shadow-white/40 text-sm sm:text-base"
            >
              Réserver un appel gratuit
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#Portfolio"
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all duration-300 flex items-center justify-center gap-2 border border-zinc-700 text-sm sm:text-base"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Voir nos réalisations
            </a>
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-12 sm:mt-20 max-w-4xl mx-auto px-4">
            {[
              { value: '150+', label: 'Vidéos produites' },
              { value: '150+', label: 'Clients satisfaits' },
              { value: '72h', label: 'Délai moyen' },
              { value: '99%', label: 'Taux satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl text-white mb-2">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
    </section>
  );
}

 