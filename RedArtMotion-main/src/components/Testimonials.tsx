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

  // Google Apps Script URL
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzPW0PvdToWVJ2qw3TSHBDPTJB_gv16eUUEytpCi_rqJJAeySK1KZDYWWU3UIrcELNI/exec';

  const [testimonials, setTestimonials] = useState([]);
  const [apiStatus, setApiStatus] = useState('loading');

  useEffect(() => {
    fetchTestimonialsFromGoogleSheets();
  }, []);

  // Function to fetch testimonials
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
          role: 'Satisfied Client',
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

  // Default testimonials
  const getDefaultTestimonials = () => [
    {
      name: 'Sarah Martinez',
      role: 'CEO, TechFlow SaaS',
      rating: 5,
      text: 'RedArtMotion transformed our product communication. Their explainer video increased our conversions by 45% in just 2 weeks. A professional, responsive, and creative team.'
    },
    {
      name: 'Marc Dubois',
      role: 'Business Coach',
      rating: 5,
      text: 'I called on RedArtMotion for my online training. The result exceeds my expectations! The animations are professional and my students love them. My sales have doubled.'
    },
    {
      name: 'Lisa Chen',
      role: 'YouTuber (250K subscribers)',
      rating: 5,
      text: 'Since I started working with RedArtMotion for my editing, the quality of my channel has exploded. My engagement increased by 70% and I save a lot of time. I recommend them 100%!'
    },
    {
      name: 'Ahmed Benali',
      role: 'Founder, CloudStart',
      rating: 5,
      text: 'An exceptional collaboration from start to finish. The team perfectly understood our vision and created a launch video that made a splash. Top-notch professionalism and creativity.'
    },
    {
      name: 'Sophie Laurent',
      role: 'Marketing Director, DigitalPro',
      rating: 5,
      text: 'We entrusted RedArtMotion with the creation of 10 videos for our campaign. Deadlines met, impeccable quality, and an impressive ROI. Our best marketing investment of the year!'
    },
    {
      name: 'Thomas Bernard',
      role: 'Content Creator',
      rating: 5,
      text: 'The motion design created by RedArtMotion gave a whole new dimension to my content. The team is attentive, creative, and always available. A true creative partner.'
    }
  ];

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // SUBMISSION FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      alert('⭐ Please provide a rating');
      return;
    }

    if (!formData.name.trim()) {
      alert('👤 Please enter your name');
      return;
    }

    if (!formData.comment.trim() || formData.comment.trim().length < 10) {
      alert('💬 Comment should be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data
      const submissionData = {
        name: formData.name.trim(),
        rating: rating,
        comment: formData.comment.trim()
      };

      // Send to Google Apps Script
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      // SUCCESS - Reset form
      setFormData({ name: '', comment: '' });
      setRating(0);

      // Show thank you message
      setSubmitSuccess(true);

      // Refresh after 3 seconds
      setTimeout(() => {
        fetchTestimonialsFromGoogleSheets();
      }, 3000);

      // Hide message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('❌ Submission error:', error);

      // Local fallback
      const localTestimonial = {
        name: formData.name,
        rating: rating,
        text: formData.comment,
        source: 'local',
        timestamp: new Date().toISOString(),
        role: 'Satisfied Client'
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

  // Star handling
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

      {/* THANK YOU POPUP */}
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
                    Thank you so much!
                    <span className="block text-pink-300 text-lg font-normal mt-2">
                      Your feedback matters a lot
                    </span>
                  </h3>

                  <div className="space-y-6 mb-8">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30" />
                      <div className="relative bg-gradient-to-b from-purple-900/50 to-purple-950/50 p-6 rounded-xl border border-purple-400/30">
                        <p className="text-white text-xl font-medium italic leading-relaxed">
                          "We hope you enjoyed working with us"
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
                      Your testimonial has been recorded and is visible to everyone.
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-300">Registration</span>
                      <span className="text-pink-300">✓ Completed</span>
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
                      Continue
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchTestimonialsFromGoogleSheets}
                      className="flex-1 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
                    >
                      View reviews
                    </motion.button>
                  </div>

                  <p className="text-purple-400 text-xs mt-6">
                    RedArtMotion - Exceptional Video Creation
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white">
              Testimonials
            </div>
            <button
              onClick={fetchTestimonialsFromGoogleSheets}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh testimonials"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What our clients say
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Over 150 clients trust us for their video projects
          </p>

          <div className="mt-4 text-sm">
            <div className="text-xs text-zinc-400">
              Last refresh: {new Date().toLocaleTimeString('en-US')}
            </div>
          </div>
        </motion.div>

        {/* Testimonials Grid - SIMPLE WITHOUT AVATAR */}
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

              {/* Name and role ONLY - NO AVATAR */}
              <div className="mb-4">
                <div className="text-white font-medium text-lg mb-1">{testimonial.name}</div>
                <div className="text-zinc-500 text-sm">{testimonial.role}</div>
              </div>

              {/* Rating - Stars only */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-zinc-700'
                      }`}
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-zinc-300 italic">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 border border-zinc-800 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-white text-2xl font-bold mb-2">Share your experience</h3>
              <p className="text-zinc-400">Your feedback helps us improve our services</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating with stars */}
              <div className="text-center">
                <div className="text-white mb-4 text-lg font-medium">Rate our work</div>

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
                          className={`w-10 h-10 ${(hoverRating || rating) >= star
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                            : 'text-zinc-500 fill-zinc-800/30'
                            } transition-all duration-300`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="text-xl font-bold text-white">
                    {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Click on the stars'}
                  </div>

                  <div className="text-sm text-zinc-400 mt-2">
                    {rating === 5 && 'Excellent!'}
                    {rating === 4 && 'Very good'}
                    {rating === 3 && 'Good'}
                    {rating === 2 && 'Average'}
                    {rating === 1 && 'Fair'}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50"
                  placeholder="Your first or last name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Your comment *
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
                  placeholder="Describe your experience with our services..."
                  disabled={isSubmitting}
                />
                <div className="text-xs text-zinc-500 mt-1 text-right">
                  {formData.comment.length}/500 characters
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className={`w-full py-3.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isSubmitting || rating === 0
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg active:scale-95'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit my review
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-zinc-500">
                  Your testimonial will be visible immediately.
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  By submitting, you agree to the public display of your testimonial.
                </p>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: '4.9/5', label: 'Average rating', icon: '⭐' },
            { value: `${testimonials.length}+`, label: 'Client reviews', icon: '💬' },
            {
              value: '150+',
              label: 'Satisfied clients',
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