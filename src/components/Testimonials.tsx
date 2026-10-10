import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Send, User, MessageSquare, Loader, RefreshCw, Heart, X } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  text: string;
  timestamp?: string;
  source?: string;
}

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
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyyiRvJDdHqKHoG8CSEx0EOvycD8aK99S8cRle3yVoqFyso4D7DqZqluBpfjxtG09Ki/exec';

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');

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
        const processedTestimonials = result.testimonials.map((item: any) => ({
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // SUBMISSION FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const submissionData = {
        name: formData.name.trim(),
        rating: rating,
        comment: formData.comment.trim()
      };

      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      setFormData({ name: '', comment: '' });
      setRating(0);
      setSubmitSuccess(true);

      setTimeout(() => {
        fetchTestimonialsFromGoogleSheets();
      }, 3000);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('❌ Submission error:', error);

      const localTestimonial: Testimonial = {
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

  const handleStarClick = (value: number) => {
    setRating(value === rating ? 0 : value);
  };

  const handleStarHover = (value: number) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  return (
    <section id="testimonials" className="py-12 sm:py-20 md:py-24 bg-zinc-900 relative overflow-hidden">
      <div id="reviews" className="absolute -top-20" />

      {/* THANK YOU POPUP MODAL */}
      <AnimatePresence>
        {submitSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gradient-to-br from-zinc-900 via-purple-950/40 to-zinc-900 border border-purple-500/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl my-auto text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSubmitSuccess(false)}
                className="absolute top-3.5 right-3.5 text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg mx-auto">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Thank you so much!
              </h3>
              <p className="text-pink-300 text-sm sm:text-base font-normal mb-5">
                Your feedback matters a lot to us
              </p>

              <div className="p-4 sm:p-5 rounded-xl bg-purple-900/30 border border-purple-400/20 mb-6">
                <p className="text-white text-base sm:text-lg font-medium italic">
                  "We hope you enjoyed working with us"
                </p>
                <div className="flex justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all text-sm sm:text-base"
                >
                  Continue
                </button>
                <button
                  onClick={fetchTestimonialsFromGoogleSheets}
                  className="w-full py-2.5 sm:py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700 text-sm sm:text-base"
                >
                  View Reviews
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex flex-row items-center justify-between gap-3 mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs sm:text-sm font-medium">
              <span>Testimonials</span>
            </div>
            <button
              onClick={fetchTestimonialsFromGoogleSheets}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors disabled:opacity-50"
              title="Refresh testimonials"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Over 150+ creators, founders, and brands trust us for their video projects
          </p>
        </motion.div>

        {/* Responsive Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}-${testimonial.source}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.08, 0.4) }}
              className="group relative p-5 sm:p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Quote background icon */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              <div>
                {/* Author Info */}
                <div className="mb-3 pr-8">
                  <div className="text-white font-semibold text-base sm:text-lg">{testimonial.name}</div>
                  <div className="text-zinc-400 text-xs sm:text-sm">{testimonial.role}</div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>

              {testimonial.timestamp && (
                <div className="mt-4 pt-3 border-t border-zinc-800/60 text-xs text-zinc-500">
                  {new Date(testimonial.timestamp).toLocaleDateString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Feedback Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-1 sm:px-0"
        >
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-zinc-800 shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">Share Your Experience</h3>
              <p className="text-zinc-400 text-xs sm:text-sm">Your feedback helps us continuously elevate our services</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Star Rating Selector */}
              <div className="text-center">
                <div className="text-white mb-3 text-sm sm:text-base font-medium">Rate our collaboration</div>

                <div className="bg-zinc-800/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/40">
                  <div className="flex justify-center gap-2 sm:gap-3 mb-3 touch-manipulation">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleStarLeave}
                        className="transform hover:scale-110 active:scale-95 transition-all p-1"
                        disabled={isSubmitting}
                        aria-label={`${star} star`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 ${
                            (hoverRating || rating) >= star
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-md'
                              : 'text-zinc-600 fill-zinc-800/50'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="text-base sm:text-lg font-bold text-white">
                    {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Tap on the stars'}
                  </div>

                  <div className="text-xs sm:text-sm text-zinc-400 mt-1">
                    {rating === 5 && 'Outstanding!'}
                    {rating === 4 && 'Very Good'}
                    {rating === 3 && 'Good'}
                    {rating === 2 && 'Average'}
                    {rating === 1 && 'Needs Improvement'}
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="text-zinc-300 text-xs sm:text-sm mb-2 flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:border-white transition-all disabled:opacity-50"
                  placeholder="e.g. John Doe"
                  disabled={isSubmitting}
                />
              </div>

              {/* Comment Input */}
              <div>
                <label className="text-zinc-300 text-xs sm:text-sm mb-2 flex items-center gap-1.5 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                  Your Review *
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  required
                  minLength={10}
                  maxLength={500}
                  rows={4}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:border-white transition-all resize-none disabled:opacity-50"
                  placeholder="Share details about the video quality, communication, and turnaround..."
                  disabled={isSubmitting}
                />
                <div className="text-[11px] sm:text-xs text-zinc-500 mt-1 text-right">
                  {formData.comment.length}/500 characters
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className={`w-full py-3 sm:py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg ${
                  isSubmitting || rating === 0
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                    : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>

              <p className="text-[11px] sm:text-xs text-zinc-500 text-center">
                Your testimonial will be published publicly on this page.
              </p>
            </form>
          </div>
        </motion.div>

        {/* Responsive Trust Indicators / Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-2"
        >
          {[
            { value: '4.9/5', label: 'Average Rating', icon: '⭐' },
            { value: `${testimonials.length}+`, label: 'Client Reviews', icon: '💬' },
            { value: '150+', label: 'Satisfied Clients', icon: '🤝' },
            { value: '99%', label: 'Satisfaction Rate', icon: '✨' }
          ].map((stat, index) => (
            <div key={index} className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 flex items-center justify-center gap-1.5">
                <span className="text-lg sm:text-xl">{stat.icon}</span>
                <span>{stat.value}</span>
              </div>
              <div className="text-zinc-500 text-xs sm:text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}