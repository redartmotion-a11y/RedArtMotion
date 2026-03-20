import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

type HeroPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface HeroVideo {
  id: string;
  title: string;
  videoId: string;
  position: HeroPosition;
}

const DEFAULT_HERO_VIDEOS: HeroVideo[] = [
  { id: '1', title: 'Motion Reel', videoId: 'dQw4w9WgXcQ', position: 'top-left' },
  { id: '2', title: 'Brand Video', videoId: 'dQw4w9WgXcQ', position: 'top-right' },
  { id: '3', title: 'Social Clip', videoId: 'dQw4w9WgXcQ', position: 'bottom-left' },
  { id: '4', title: 'Ad Film', videoId: 'dQw4w9WgXcQ', position: 'bottom-right' },
];

const extractYouTubeId = (url: string) => {
  if (!url) return '';
  if (url.length === 11 && !url.includes('/')) return url;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url;
};

export function Hero() {
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>(DEFAULT_HERO_VIDEOS);

  const API_URL = 'https://script.google.com/macros/s/AKfycbyyiRvJDdHqKHoG8CSEx0EOvycD8aK99S8cRle3yVoqFyso4D7DqZqluBpfjxtG09Ki/exec';

  const fetchHeroVideos = async () => {
    try {
      const response = await fetch(`${API_URL}?action=getHeroVideos`);
      const data = await response.json();
      if (data.success && data.videos && data.videos.length > 0) {
        setHeroVideos(data.videos);
      }
    } catch (error) {
      console.error('Error loading hero videos from API:', error);
      // Fallback to local storage if API fails
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
      // Reverted to exactly what the user provided
      case 'top-left': return { top: '18%', left: '6%' };
      case 'bottom-left': return { top: '60%', left: '8%' };
      case 'top-right': return { top: '20%', right: '6%' };
      case 'bottom-right': return { top: '65%', right: '8%' };
      default: return {};
    }
  };

  const getAnimProps = (position: HeroPosition) => {
    switch (position) {
      // In CSS 3D transforms: positive rotateY brings the left side closer and pushes right side away.
      // Top-left and bottom-left in the image have the left side closer to the viewer.
      case 'top-left': return { rotateY: 25, rotateX: 0, rotateZ: 5 };
      case 'bottom-left': return { rotateY: 25, rotateX: 0, rotateZ: -5 };
      // Top-right and bottom-right have the right side closer to the viewer.
      case 'top-right': return { rotateY: -25, rotateX: 0, rotateZ: -5 };
      case 'bottom-right': return { rotateY: -25, rotateX: 0, rotateZ: 5 };
      default: return { rotateY: 0, rotateX: 0, rotateZ: 0 };
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI3MjcyNyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

      <div 
        className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden max-w-[100vw]" 
      >
        {heroVideos.map((video, index) => {
          const ytId = extractYouTubeId(video.videoId);
          const animProps = getAnimProps(video.position);
          
          return (
            <motion.div
              key={video.id}
              className="absolute w-44 lg:w-56 xl:w-64 pointer-events-auto rounded-2xl"
              style={{
                ...getPositionStyles(video.position),
                perspective: '1000px',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1, 
                scale: 1,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: index * 0.2,
              }}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden border-2 border-white/90 shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] cursor-pointer"
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
                  ease: "easeOut",
                }}
                onClick={() => window.open(`https://youtube.com/watch?v=${ytId}`, '_blank')}
              >
                <div className="aspect-video bg-zinc-900 relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`}
                    className="w-full h-full object-cover scale-[1.35] select-none pointer-events-none"
                    allow="autoplay; encrypted-media"
                    frameBorder="0"
                  ></iframe>
                  {/* Overlay to ensure the card remains clickable and has the glow effect */}
                  <div className="absolute inset-0 bg-transparent shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] pointer-events-none"></div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center pointer-events-none">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="pointer-events-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-6 sm:mb-8 hover:bg-white/20 transition-colors">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Video Editing & Motion Design Studio</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-white mb-4 sm:mb-6 max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
            Transform your ideas into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              impactful videos
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 px-4 leading-relaxed">
            Professional video editing, motion design & explainer videos for SaaS,
            Coaches, YouTubers, and Content Creators who want to captivate their audience
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center px-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group px-8 sm:px-10 py-3 sm:py-4 bg-white text-black rounded-full hover:bg-zinc-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] text-sm sm:text-base font-bold"
            >
              Hire Me
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group px-8 sm:px-10 py-3 sm:py-4 bg-zinc-900 border border-zinc-700 text-white rounded-full hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              View My Work
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-24 max-w-4xl mx-auto px-4">
            {[
              { value: '150+', label: 'Videos produced' },
              { value: '150+', label: 'Satisfied clients' },
              { value: '72h', label: 'Average turnaround' },
              { value: '99%', label: 'Satisfaction rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="text-center group"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}

