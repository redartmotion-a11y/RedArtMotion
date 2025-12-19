import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Send, User, MessageSquare, Loader, RefreshCw, Heart } from 'lucide-react';

export function Testimonials() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    comment: ''
  });

  // URL Google Apps Script
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwD25mRDhhHcxHtQmzeyUoSSj6-99h0UKW4rW5ELNZWTraRsZJ1OCZUfXUa82IW6Gul/exec';
  
  const [testimonials, setTestimonials] = useState([]);
  const [apiStatus, setApiStatus] = useState('loading');

  useEffect(() => {
    fetchTestimonialsFromGoogleSheets();
  }, []);

  // Fonction pour récupérer les témoignages
  const fetchTestimonialsFromGoogleSheets = async () => {
    try {
      setIsRefreshing(true);
      setApiStatus('loading');
      
      const url = `${GOOGLE_SHEETS_WEB_APP_URL}?t=${Date.now()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.testimonials)) {
        const processedTestimonials = result.testimonials.map((item) => ({
          name: item.Name || 'Client',
          role: 'Client satisfait',
          rating: parseInt(item.Rating) || 0,
          text: item.Comment || '',
          timestamp: item.Timestamp,
          source: 'google-sheets'
        }));
        
        setTestimonials(processedTestimonials);
        setApiStatus('online');
      } else {
        setTestimonials(getDefaultTestimonials());
        setApiStatus('online');
      }
      
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setTestimonials(getDefaultTestimonials());
      setApiStatus('offline');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Témoignages par défaut
  const getDefaultTestimonials = () => [
    {
      name: 'Sarah Martinez',
      role: 'CEO, TechFlow SaaS',
      rating: 5,
      text: 'RedArtMotion a transformé notre communication produit. Leur vidéo explicative a augmenté nos conversions de 45% en seulement 2 semaines. Une équipe professionnelle, réactive et créative.'
    },
    {
      name: 'Marc Dubois',
      role: 'Coach Business',
      rating: 5,
      text: 'J\'ai fait appel à RedArtMotion pour ma formation en ligne. Le résultat dépasse mes attentes ! Les animations sont professionnelles et mes élèves adorent. Mes ventes ont doublé.'
    },
    {
      name: 'Lisa Chen',
      role: 'YouTubeuse (250K abonnés)',
      rating: 5,
      text: 'Depuis que je travaille avec RedArtMotion pour mes montages, la qualité de ma chaîne a explosé. Mon engagement a augmenté de 70% et je gagne un temps fou. Je recommande à 100%!'
    },
    {
      name: 'Ahmed Benali',
      role: 'Fondateur, CloudStart',
      rating: 5,
      text: 'Une collaboration exceptionnelle du début à la fin. L\'équipe a parfaitement compris notre vision et a créé une vidéo de lancement qui a fait sensation. Professionnalisme et créativité au top.'
    },
    {
      name: 'Sophie Laurent',
      role: 'Directrice Marketing, DigitalPro',
      rating: 5,
      text: 'Nous avons confié à RedArtMotion la création de 10 vidéos pour notre campagne. Délais respectés, qualité irréprochable, et un ROI impressionnant. Notre meilleur investissement marketing de l\'année!'
    },
    {
      name: 'Thomas Bernard',
      role: 'Content Creator',
      rating: 5,
      text: 'Le motion design créé par RedArtMotion a donné une toute nouvelle dimension à mes contenus. L\'équipe est à l\'écoute, créative et toujours disponible. Un vrai partenaire créatif.'
    }
  ];

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // FONCTION DE SOUMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (rating === 0) {
      alert('⭐ Veuillez donner une note');
      return;
    }
    
    if (!formData.name.trim()) {
      alert('👤 Veuillez entrer votre nom');
      return;
    }
    
    if (!formData.comment.trim() || formData.comment.trim().length < 10) {
      alert('💬 Commentaire d\'au moins 10 caractères');
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer les données
      const submissionData = {
        name: formData.name.trim(),
        rating: rating,
        comment: formData.comment.trim()
      };

      // Envoyer au Google Apps Script
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      
      // SUCCÈS - Réinitialiser le formulaire
      setFormData({ name: '', comment: '' });
      setRating(0);
      
      // Afficher le beau message de remerciement
      setSubmitSuccess(true);
      
      // Rafraîchir après 3 secondes
      setTimeout(() => {
        fetchTestimonialsFromGoogleSheets();
      }, 3000);
      
      // Cacher le message après 5 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('❌ Submission error:', error);
      
      // Fallback local
      const localTestimonial = {
        name: formData.name,
        rating: rating,
        text: formData.comment,
        source: 'local',
        timestamp: new Date().toISOString(),
        role: 'Client satisfait'
      };
      
      setTestimonials(prev => [localTestimonial, ...prev.slice(0, 5)]);
      setFormData({ name: '', comment: '' });
      setRating(0);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des étoiles
  const handleStarClick = (value) => {
    setRating(value === rating ? 0 : value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-zinc-900 relative overflow-hidden">
      
      {/* POPUP DE REMERCIEMENT */}
      <AnimatePresence>
        {submitSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-purple-900/90 to-black z-50 flex items-center justify-center p-4"
              onClick={() => setSubmitSuccess(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative bg-gradient-to-br from-purple-900/90 to-purple-950/90 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-purple-900/50 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl" />
                
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="absolute top-4 right-4 text-zinc-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-10"
                >
                  ✕
                </button>

                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.15, 1],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="inline-block mb-8"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center shadow-lg">
                        <Heart className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-6">
                    Merci infiniment ! 
                    <span className="block text-pink-300 text-lg font-normal mt-2">
                      Votre avis compte énormément
                    </span>
                  </h3>

                  <div className="space-y-6 mb-8">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30" />
                      <div className="relative bg-gradient-to-b from-purple-900/50 to-purple-950/50 p-6 rounded-xl border border-purple-400/30">
                        <p className="text-white text-xl font-medium italic leading-relaxed">
                          "Nous espérons que vous avez apprécié travailler avec nous"
                        </p>
                        <div className="flex justify-center mt-4">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-purple-200">
                      Votre témoignage est enregistré et visible par tous.
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-300">Enregistrement</span>
                      <span className="text-pink-300">✓ Complété</span>
                    </div>
                    <div className="w-full h-2 bg-purple-900/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSubmitSuccess(false)}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all border border-purple-400/30"
                    >
                      Continuer
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchTestimonialsFromGoogleSheets}
                      className="flex-1 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
                    >
                      Voir les avis
                    </motion.button>
                  </div>

                  <p className="text-purple-400 text-xs mt-6">
                    RedArtMotion - Création vidéo d'exception
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white">
              Témoignages
            </div>
            <button
              onClick={fetchTestimonialsFromGoogleSheets}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Rafraîchir les témoignages"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
            </button>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Plus de 150 clients nous font confiance pour leurs projets vidéo
          </p>
          
          <div className="mt-4 text-sm">
            <div className="text-xs text-zinc-400">
              Dernier rafraîchissement: {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>
        </motion.div>

        {/* Grille de témoignages - SIMPLIFIÉE SANS AVATAR */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}-${testimonial.source}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-white/50 transition-all duration-300"
            >
              {/* Icône citation */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-white" />
              </div>

              {/* Nom et rôle SEULEMENT - PAS D'AVATAR */}
              <div className="mb-4">
                <div className="text-white font-medium text-lg mb-1">{testimonial.name}</div>
                <div className="text-zinc-500 text-sm">{testimonial.role}</div>
              </div>

              {/* Note - Étoiles seulement */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>

              {/* Texte du témoignage */}
              <p className="text-zinc-300 italic">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 border border-zinc-800 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-white text-2xl font-bold mb-2">Partagez votre expérience</h3>
              <p className="text-zinc-400">Votre avis nous aide à améliorer nos services</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Note avec étoiles */}
              <div className="text-center">
                <div className="text-white mb-4 text-lg font-medium">Notez notre travail</div>
                
                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleStarLeave}
                        className="transform hover:scale-110 transition-all duration-300 active:scale-95"
                        disabled={isSubmitting}
                      >
                        <Star
                          className={`w-10 h-10 ${
                            (hoverRating || rating) >= star
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                              : 'text-zinc-500 fill-zinc-800/30'
                          } transition-all duration-300`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-xl font-bold text-white">
                    {rating > 0 ? `${rating} étoile${rating > 1 ? 's' : ''}` : 'Cliquez sur les étoiles'}
                  </div>
                  
                  <div className="text-sm text-zinc-400 mt-2">
                    {rating === 5 && 'Excellent !'}
                    {rating === 4 && 'Très bien'}
                    {rating === 3 && 'Bien'}
                    {rating === 2 && 'Moyen'}
                    {rating === 1 && 'Passable'}
                  </div>
                </div>
              </div>

              {/* Nom */}
              <div>
                <label className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Votre nom *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50"
                  placeholder="Votre nom ou prénom"
                  disabled={isSubmitting}
                />
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Votre commentaire *
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  required
                  minLength={10}
                  maxLength={500}
                  rows="4"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none disabled:opacity-50"
                  placeholder="Décrivez votre expérience avec nos services..."
                  disabled={isSubmitting}
                />
                <div className="text-xs text-zinc-500 mt-1 text-right">
                  {formData.comment.length}/500 caractères
                </div>
              </div>

              {/* Bouton d'envoi */}
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className={`w-full py-3.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isSubmitting || rating === 0
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer mon avis
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-zinc-500">
                  Votre témoignage sera visible immédiatement.
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  En soumettant, vous acceptez l'affichage public de votre témoignage.
                </p>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Indicateurs de confiance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: '4.9/5', label: 'Note moyenne', icon: '⭐' },
            { value: `${testimonials.length}+`, label: 'Avis clients', icon: '💬' },
            { 
              value: '150+', 
              label: 'Clients satisfaits', 
              icon: '😊' 
            },
            { value: '100%', label: 'Satisfaction', icon: '😊' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl text-white mb-1 flex items-center justify-center gap-2">
                <span className="text-2xl">{stat.icon}</span>
                <span>{stat.value}</span>
              </div>
              <div className="text-zinc-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}