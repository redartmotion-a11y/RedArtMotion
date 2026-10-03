import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Quels sont vos délais de livraison ?',
      answer: 'Les délais varient selon la complexité du projet. En moyenne, comptez 5-10 jours pour une vidéo courte (30-60s), 7-14 jours pour une vidéo standard (1-3 min), et 2-3 semaines pour un projet premium (3-10 min). Nous proposons aussi des options de livraison express.'
    },
    {
      question: 'Combien de révisions sont incluses ?',
      answer: 'Le nombre de révisions dépend du package choisi : 2 révisions pour les vidéos courtes, 3 révisions pour les vidéos standard, et révisions illimitées pour le package premium. Nous travaillons avec vous jusqu\'à ce que vous soyez 100% satisfait du résultat.'
    },
    {
      question: 'Fournissez-vous la musique et les voix-off ?',
      answer: 'Oui ! Nous avons accès à des bibliothèques de musiques libres de droits professionnelles. Pour les voix-off, nous pouvons vous proposer des voix professionnelles en français, anglais et arabe. Le mixage audio est toujours inclus dans nos prestations.'
    },
    {
      question: 'Dans quels formats livrez-vous les vidéos ?',
      answer: 'Nous livrons vos vidéos dans tous les formats dont vous avez besoin : MP4 (HD 1080p ou 4K), formats optimisés pour YouTube, Instagram, Facebook, LinkedIn, TikTok (16:9, 1:1, 9:16). Vous recevez également les fichiers sources sur demande.'
    },
    {
      question: 'Qui détient les droits de la vidéo finale ?',
      answer: 'Vous détenez tous les droits d\'utilisation commerciale de la vidéo livrée. Vous pouvez l\'utiliser librement sur toutes vos plateformes, campagnes publicitaires, etc. Nous conservons uniquement le droit de présenter le projet dans notre portfolio, sauf demande contraire de votre part.'
    },
    {
      question: 'Dois-je fournir les images et vidéos ?',
      answer: 'Cela dépend de votre projet. Si vous avez du contenu existant (footage, photos, logos), nous l\'intégrons dans la création. Sinon, nous avons accès à des banques d\'images et vidéos professionnelles (premium stock). Nous pouvons aussi créer des animations 2D/3D sur mesure.'
    },
    {
      question: 'Comment se déroule le paiement ?',
      answer: 'Nous demandons généralement un acompte de 50% au démarrage du projet, et les 50% restants à la livraison finale. Pour les projets récurrents ou packages multiples, nous proposons des modalités de paiement flexibles. Paiement possible par virement bancaire ou PayPal.'
    },
    {
      question: 'Travaillez-vous avec des clients internationaux ?',
      answer: 'Absolument ! Nous travaillons avec des clients du monde entier. Nous sommes habitués à collaborer à distance et proposons des vidéos en français, anglais et arabe. Nos horaires sont flexibles pour s\'adapter à différents fuseaux horaires.'
    },
    {
      question: 'Proposez-vous des contrats mensuels pour créateurs de contenu ?',
      answer: 'Oui, nous proposons des formules d\'abonnement mensuel pour les YouTubeurs, créateurs de contenu et entreprises ayant des besoins réguliers. Ces formules incluent un nombre défini de vidéos par mois à tarif préférentiel, avec un support prioritaire.'
    },
    {
      question: 'Que dois-je préparer avant de démarrer le projet ?',
      answer: 'Pour démarrer efficacement, préparez : votre objectif principal, votre audience cible, les messages clés à transmettre, vos éléments de branding (logo, couleurs, charte graphique), et des exemples de vidéos que vous aimez. Nous vous guiderons pour le reste lors de notre premier appel.'
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
            Questions fréquentes
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            Vous avez des questions ? Nous avons les réponses
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
          <h3 className="text-white mb-3">Vous avez d'autres questions ?</h3>
          <p className="text-zinc-400 mb-6">
            Notre équipe est disponible pour répondre à toutes vos questions
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Nous contacter
          </a>
        </motion.div>
      </div>
    </section>
  );
}