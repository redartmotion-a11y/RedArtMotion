import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What are your delivery times?',
      answer: 'Delivery times vary depending on the complexity of the project. On average, expect 5-10 days for a short video (30-60s), 7-14 days for a standard video (1-3 min), and 2-3 weeks for a premium project (3-10 min). We also offer express delivery options.'
    },
    {
      question: 'How many revisions are included?',
      answer: 'The number of revisions depends on the package chosen: 2 revisions for short videos, 3 revisions for standard videos, and unlimited revisions for the premium package. We work with you until you are 100% satisfied with the result.'
    },
    {
      question: 'Do you provide music and voice-overs?',
      answer: 'Yes! We have access to professional royalty-free music libraries. For voice-overs, we can provide professional voices in English, French, and Arabic. Audio mixing is always included in our services.'
    },
    {
      question: 'What formats do you deliver the videos in?',
      answer: 'We deliver your videos in all the formats you need: MP4 (HD 1080p or 4K), optimized formats for YouTube, Instagram, Facebook, LinkedIn, TikTok (16:9, 1:1, 9:16). You also receive source files upon request.'
    },
    {
      question: 'Who owns the rights to the final video?',
      answer: 'You own all commercial use rights to the delivered video. You can use it freely on all your platforms, advertising campaigns, etc. We only retain the right to present the project in our portfolio, unless you request otherwise.'
    },
    {
      question: 'Do I need to provide images and videos?',
      answer: 'It depends on your project. If you have existing content (footage, photos, logos), we integrate it into the creation. Otherwise, we have access to professional image and video banks (premium stock). We can also create custom 2D/3D animations.'
    },
    {
      question: 'How does payment work?',
      answer: 'We generally ask for a 50% deposit at the start of the project, and the remaining 50% upon final delivery. For recurring projects or multi-packages, we offer flexible payment terms. Payment is possible by bank transfer or PayPal.'
    },
    {
      question: 'Do you work with international clients?',
      answer: 'Absolutely! We work with clients from all over the world. We are used to collaborating remotely and offer videos in English, French, and Arabic. Our hours are flexible to adapt to different time zones.'
    },
    {
      question: 'Do you offer monthly contracts for content creators?',
      answer: 'Yes, we offer monthly subscription plans for YouTubers, content creators, and companies with regular needs. These plans include a set number of videos per month at a preferential rate, with priority support.'
    },
    {
      question: 'What should I prepare before starting the project?',
      answer: 'To start effectively, prepare: your main goal, your target audience, the key messages to convey, your branding elements (logo, colors, graphic charter), and examples of videos you like. We will guide you for the rest during our first call.'
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-4">
            FAQ
          </div>
          <h2 className="text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            Have questions? We have answers
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-900/50 transition-colors"
              >
                <span className="text-white pr-8">{faq.question}</span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-zinc-400 border-t border-zinc-800">
                      <div className="pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl"
        >
          <h3 className="text-white mb-3">Still have questions?</h3>
          <p className="text-zinc-400 mb-6">
            Our team is available to answer all your questions
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}