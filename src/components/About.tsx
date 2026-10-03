import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, Zap, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous visons la perfection dans chaque projet, avec une attention méticuleuse aux détails'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Votre vision est au cœur de notre processus. Nous travaillons main dans la main avec vous'
    },
    {
      icon: Zap,
      title: 'Réactivité',
      description: 'Délais respectés et communication fluide. Votre temps est précieux'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Chaque vidéo est créée avec passion et dévouement pour raconter votre histoire'
    }
  ];

  const stats = [
    { value: '5+', label: 'Années d\'expérience' },
    { value: '500+', label: 'Projets réalisés' },
    { value: '200+', label: 'Clients satisfaits' },
    { value: '15+', label: 'Prix & reconnaissances' }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-4">
            À propos
          </div>
          <h2 className="text-white mb-4">
            Votre partenaire créatif
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            RedArtMotion est un studio spécialisé dans la création de vidéos qui convertissent
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1757845524683-611470b2d7ce?w=800&q=80"
                alt="RedArtMotion Studio"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </div>
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -right-6 bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-xl">
              <div className="text-3xl text-white mb-1">98%</div>
              <div className="text-zinc-400 text-sm">Taux de satisfaction</div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white mb-6">
              Nous transformons vos idées en vidéos qui captivent et convertissent
            </h3>
            <div className="space-y-4 text-zinc-400 mb-8">
              <p>
                Depuis plus de 5 ans, nous accompagnons les entrepreneurs, créateurs de contenu 
                et entreprises tech dans la création de vidéos professionnelles qui font la différence.
              </p>
              <p>
                Notre expertise couvre tous les aspects de la production vidéo : du montage au 
                motion design, en passant par le color grading et le sound design. Nous maîtrisons 
                les codes de chaque plateforme et adaptons nos créations à vos objectifs.
              </p>
              <p>
                Que vous ayez besoin d'une vidéo explicative pour votre SaaS, de contenus engageants 
                pour YouTube, ou de formations vidéo percutantes, nous avons l'expérience et les 
                compétences pour donner vie à votre vision.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-800">
                  <div className="text-2xl text-white mb-1">{stat.value}</div>
                  <div className="text-zinc-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white mb-2">{value.title}</h4>
              <p className="text-zinc-400 text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}