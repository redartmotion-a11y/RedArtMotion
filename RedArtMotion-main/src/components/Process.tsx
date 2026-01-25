import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Lightbulb, CheckCircle, Video, Rocket } from 'lucide-react';

export function Process() {
  const steps = [
    {
      icon: MessageSquare,
      number: '01',
      title: 'Diagnosis & Brief',
      description: 'Analysis of your needs, goals, and constraints. Discussion about your vision and expectations.',
      duration: '30-60 min'
    },
    {
      icon: Lightbulb,
      number: '02',
      title: 'Storyboard & Concept',
      description: 'Storyboard creation, visual style definition, and creative direction validation.',
      duration: '2-3 days'
    },
    {
      icon: CheckCircle,
      number: '03',
      title: 'Validation',
      description: 'Concept presentation, adjustments based on your feedback, and final validation before production.',
      duration: '1-2 days'
    },
    {
      icon: Rocket,
      number: '04',
      title: 'Production, Editing & Delivery',
      description: 'Video editing, motion design, color grading, audio mixing - creation of your final video. Final revisions, export in all necessary formats, and delivery of your files.',
      duration: '3-7 days'
    },
  ];

  return (
    <section id="processus" className="py-16 sm:py-24 bg-zinc-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dc262620_1px,transparent_1px),linear-gradient(to_bottom,#dc262620_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-4">
            Our Process
          </div>
          <h2 className="text-white mb-4">
            From Idea to Final Video
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            A clear and efficient process to ensure the success of your project
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Timeline Line - Hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white via-white/50 to-transparent -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-inherit`}>
                  <div className="inline-block lg:block">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <span className="text-5xl text-white/20">{step.number}</span>
                    </div>
                    <h3 className="text-white mb-3">{step.title}</h3>
                    <p className="text-zinc-400 mb-3 max-w-md mx-auto lg:mx-0">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-zinc-400 text-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      {step.duration}
                    </div>
                  </div>
                </div>

                {/* Icon Circle */}
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-white to-zinc-100 rounded-full flex items-center justify-center shadow-lg shadow-white/30">
                    <step.icon className="w-10 h-10 text-black" />
                  </div>
                </div>

                {/* Spacer for alignment */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-block p-8 bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl">
            <h3 className="text-white mb-3">Ready to start your project?</h3>
            <p className="text-zinc-400 mb-6 max-w-lg">
              Book a free call to discuss your project and get a personalized quote
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Book My Free Call
              <Rocket className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}