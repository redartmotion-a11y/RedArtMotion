import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Sparkles, ChevronDown, X } from 'lucide-react';

type HeroPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface HeroVideo {
  id: string;
  title: string;
  videoId: string;
  position: HeroPosition;
}

const DEFAULT_HERO_VIDEOS: HeroVideo[] = [
  { id: '1774626819844', title: 'yoo', videoId: 'hcYSCzfv1OA', position: 'top-left' },
  { id: '1774627905995', title: 'm', videoId: 'csNB6GxSnoE', position: 'top-right' },
  { id: '1774627944567', title: 'matice', videoId: 'u1T1eoezCU4', position: 'bottom-left' },
  { id: '1774627099965', title: 'arie', videoId: 'HLkRGGwdYUU', position: 'bottom-right' },
];

const extractYouTubeId = (url: string) => {
  if (!url) return '';
  if (url.length === 11 && !url.includes('/')) return url;
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url;
};

export function Hero() {
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>(() => {
    try {
      const stored = localStorage.getItem('heroVideos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_HERO_VIDEOS;
    } catch {
      return DEFAULT_HERO_VIDEOS;
    }
  });

  const API_URL = 'https://script.google.com/macros/s/AKfycbyyiRvJDdHqKHoG8CSEx0EOvycD8aK99S8cRle3yVoqFyso4D7DqZqluBpfjxtG09Ki/exec';

  const fetchHeroVideos = async () => {
    try {
      const response = await fetch(`${API_URL}?action=getHeroVideos`);
      const data = await response.json();
      if (data.success && data.videos && data.videos.length > 0) {
        setHeroVideos(data.videos);
        localStorage.setItem('heroVideos', JSON.stringify(data.videos));
      }
    } catch (error) {
      console.error('Error loading hero videos from API:', error);
      try {
        const stored = localStorage.getItem('heroVideos');
        if (stored) setHeroVideos(JSON.parse(stored));
      } catch {}
    }
  };

  useEffect(() => {
    fetchHeroVideos();
    window.addEventListener('heroVideosUpdated', fetchHeroVideos);
    return () => window.removeEventListener('heroVideosUpdated', fetchHeroVideos);
  }, []);

  const getPositionStyles = (position: HeroPosition) => {
    switch (position) {
      case 'top-left': return { top: '10%', left: '3%' };
      case 'bottom-left': return { top: '44%', left: '3%' };
      case 'top-right': return { top: '12%', right: '3%' };
      case 'bottom-right': return { top: '46%', right: '3%' };
      default: return {};
    }
  };

  const getAnimProps = (position: HeroPosition) => {
    switch (position) {
      case 'top-left': return { rotateY: 22, rotateX: 0, rotateZ: 4 };
      case 'bottom-left': return { rotateY: 22, rotateX: 0, rotateZ: -4 };
      case 'top-right': return { rotateY: -22, rotateX: 0, rotateZ: -4 };
      case 'bottom-right': return { rotateY: -22, rotateX: 0, rotateZ: 4 };
      default: return { rotateY: 0, rotateX: 0, rotateZ: 0 };
    }
  };

  const validHeroVideos = Array.isArray(heroVideos)
    ? heroVideos.filter((v) => v && typeof v === 'object' && v.videoId)
    : [];
  const videosToRender = validHeroVideos.length > 0 ? validHeroVideos : DEFAULT_HERO_VIDEOS;
  const [selectedVideoModal, setSelectedVideoModal] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-16 pb-12 sm:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI3MjcyNyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI2MCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />

      {/* Floating 3D Video Cards on Desktop & Mobile */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden max-w-[100vw]">
        {videosToRender.map((video, index) => {
          const ytId = extractYouTubeId(video.videoId);
          const animProps = getAnimProps(video.position);

          return (
            <motion.div
              key={video.id || index}
              className={`hero-floating-card pos-${video.position}`}
              style={{
                perspective: '1000px',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.2,
                ease: 'easeOut',
                delay: index * 0.15,
                y: {
                  duration: 3 + index * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              <motion.div
                className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/60 sm:border-2 sm:border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.25)] sm:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] cursor-pointer bg-zinc-950"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                initial={{
                  rotateY: animProps.rotateY,
                  rotateX: animProps.rotateX,
                  rotateZ: animProps.rotateZ,
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 0,
                  rotateX: 0,
                  rotateZ: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                onClick={() => setSelectedVideoModal(ytId)}
              >
                <div className="aspect-video bg-zinc-900 relative">
                  {/* Desktop: Live looping iframe */}
                  <div className="hidden lg:block w-full h-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
                      className="w-full h-full object-cover scale-[1.35] select-none pointer-events-none"
                      allow="autoplay; encrypted-media"
                      frameBorder="0"
                      title={video.title || 'Hero video'}
                    />
                  </div>

                  {/* Mobile & Tablet (< 1024px): Crisp High-Res Card with Frosted Glass Play Badge */}
                  <div className="block lg:hidden w-full h-full relative">
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                      alt={video.title || 'Video preview'}
                      className="w-full h-full object-cover scale-[1.05]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-white/25 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-lg shadow-black/60">
                        <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-transparent shadow-[inset_0_0_15px_rgba(255,255,255,0.35)] pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4 sm:py-20 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 border border-white/20 rounded-full text-white mb-4 sm:mb-6 hover:bg-white/20 transition-colors">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="text-[11px] sm:text-sm font-medium">Video Editing & Motion Design Studio</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-white mb-3 sm:mb-5 max-w-4xl mx-auto text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Transform your ideas into{' '}
            <span
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-300"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              impactful videos
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-zinc-400 text-xs sm:text-base lg:text-lg max-w-xs sm:max-w-2xl mx-auto mb-5 sm:mb-8 px-2 leading-relaxed font-normal">
            Professional video editing, motion design & explainer videos for SaaS,
            Coaches, YouTubers, and Content Creators who want to captivate their audience
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row gap-2.5 sm:gap-4 justify-center items-center px-2 max-w-sm sm:max-w-none mx-auto w-full">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hero-cta-btn bg-white text-black hover:bg-zinc-200 transition-all duration-300 gap-1.5 sm:gap-2 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] text-xs sm:text-base font-bold shrink-0"
            >
              <span>Hire Me</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
            </a>

            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hero-cta-btn bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white hover:bg-zinc-800 transition-all duration-300 gap-1.5 sm:gap-2 text-xs sm:text-base font-medium shrink-0"
            >
              <Play className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-white shrink-0" />
              <span>View My Work</span>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 sm:gap-8 mt-6 sm:mt-12 lg:mt-16 max-w-4xl mx-auto px-2 relative z-20">
            {[
              { value: '150+', label: 'VIDEOS PRODUCED' },
              { value: '150+', label: 'SATISFIED CLIENTS' },
              { value: '72h', label: 'AVERAGE TURNAROUND' },
              { value: '99%', label: 'SATISFACTION RATE' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="text-center group p-1 sm:p-0"
              >
                <div className="text-xl xs:text-2xl sm:text-4xl font-extrabold text-white mb-0.5 sm:mb-1 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-[10px] xs:text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Modal Popup */}
      {selectedVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setSelectedVideoModal(null)}
        >
          <div
            className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-white/20 bg-zinc-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideoModal}?autoplay=1&controls=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title="Hero video player"
            />
            <button
              onClick={() => setSelectedVideoModal(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}