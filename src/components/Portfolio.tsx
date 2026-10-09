import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Youtube, FileVideo, Globe, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

interface Project {
  id: string;
  title: string;
  description: string;
  videoId: string;
  category: string;
  client: string;
  duration: string;
  type: string;
  videoLength: string;
  views: number;
  engagement: number;
  thumbnail: string;
  videoUrl: string;
}

const DEFAULT_REAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Short Form & Viral Content Creation',
    description: 'Dynamic pacing, custom captions, kinetic typography, and audio design crafted for high-retention social media.',
    videoId: 'hcYSCzfv1OA',
    category: 'Short Form',
    client: 'Content Creator',
    duration: '0:55',
    type: 'YouTube',
    videoLength: '55',
    views: 45000,
    engagement: 96,
    thumbnail: 'https://img.youtube.com/vi/hcYSCzfv1OA/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=hcYSCzfv1OA',
  },
  {
    id: '2',
    title: 'Dynamic Motion Design & Visual FX',
    description: 'High-impact 2D/3D motion graphics, visual effects, and fluid transitions tailored for tech brands and SaaS products.',
    videoId: 'csNB6GxSnoE',
    category: 'Motion Design',
    client: 'RedArtMotion Studio',
    duration: '1:15',
    type: 'YouTube',
    videoLength: '75',
    views: 28000,
    engagement: 92,
    thumbnail: 'https://img.youtube.com/vi/csNB6GxSnoE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=csNB6GxSnoE',
  },
  {
    id: '3',
    title: 'Studio Podcast & Multi-Camera Grading',
    description: 'Professional color grading, seamless multi-angle cuts, and crystal-clear audio mastering for studio podcasts.',
    videoId: 'u1T1eoezCU4',
    category: 'Video Editing',
    client: 'Podcast & Media',
    duration: '2:40',
    type: 'YouTube',
    videoLength: '160',
    views: 38000,
    engagement: 94,
    thumbnail: 'https://img.youtube.com/vi/u1T1eoezCU4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=u1T1eoezCU4',
  },
  {
    id: '4',
    title: 'SaaS Explainer & High-Converting Video',
    description: 'Story-driven explainer video transforming complex software features into captivating, conversion-ready visuals.',
    videoId: 'HLkRGGwdYUU',
    category: 'Explainer Videos',
    client: 'Tech & SaaS',
    duration: '1:45',
    type: 'YouTube',
    videoLength: '105',
    views: 52000,
    engagement: 98,
    thumbnail: 'https://img.youtube.com/vi/HLkRGGwdYUU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=HLkRGGwdYUU',
  },
];

export function Portfolio() {
  const [selectedVideo, setSelectedVideo] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('portfolioVideos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_REAL_PROJECTS;
  });
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    containScroll: false,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const API_URL = 'https://script.google.com/macros/s/AKfycbyyiRvJDdHqKHoG8CSEx0EOvycD8aK99S8cRle3yVoqFyso4D7DqZqluBpfjxtG09Ki/exec';

  const getPlatformIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'drive':
      case 'google drive': return <FileVideo className="w-4 h-4 text-blue-400" />;
      default: return <Globe className="w-4 h-4 text-purple-400" />;
    }
  };

  const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    if (url.length === 11 && !url.includes('/')) return url;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
    return '';
  };

  const processVideoData = (video: any): Project => {
    let videoId = video.videoId || '';
    let thumbnail = '';
    let videoUrl = '#';
    const type = video.type || 'YouTube';

    if (type.toLowerCase() === 'youtube') {
      const id = extractYouTubeId(videoId);
      videoId = id;
      thumbnail = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
      videoUrl = id ? `https://www.youtube.com/watch?v=${id}` : '#';
    } else {
      thumbnail = videoId.startsWith('http') ? videoId : '';
      videoUrl = videoId.startsWith('http') ? videoId : '#';
    }

    if (!thumbnail) {
      thumbnail = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80';
    }

    return {
      id: String(video.id || Math.random()),
      title: video.title || 'Untitled Project',
      description: video.description || '',
      videoId,
      category: video.category || 'Short Form',
      client: video.client || 'RedArtMotion',
      duration: video.duration || '1:00',
      type,
      videoLength: video.videoLength || '60',
      views: Number(video.views) || 25000,
      engagement: Number(video.engagement) || 92,
      thumbnail,
      videoUrl,
    };
  };

  const fetchProjects = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_URL}?action=getVideos`, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
        const list = data.videos.map((v: any) => processVideoData(v));
        setProjects(list);
        localStorage.setItem('portfolioVideos', JSON.stringify(list));
      }
    } catch {
      // Silently fall back to DEFAULT_REAL_PROJECTS
    }
  };

  useEffect(() => {
    fetchProjects();
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('portfolioVideos');
        if (saved) setProjects(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('portfolioVideosUpdated', handleUpdate);
    return () => window.removeEventListener('portfolioVideosUpdated', handleUpdate);
  }, []);

  return (
    <section id="portfolio" className="py-20 sm:py-32 bg-zinc-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 px-4 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-4">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-xs sm:text-sm font-medium tracking-wide">Featured Works</span>
        </div>
        <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Our Recent Projects
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
          Swipe left and right to explore our video editing, motion design, and explainer videos
        </p>
      </motion.div>

      {/* Swipeable Carousel */}
      <div className="relative max-w-7xl mx-auto">
        {/* Embla viewport */}
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{ padding: '30px 0' }}
          ref={emblaRef}
        >
          <div
            className="flex touch-pan-y items-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {projects.map((project, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  key={project.id}
                  className="flex-none px-3 sm:px-4"
                  style={{
                    width: 'clamp(300px, 78vw, 980px)',
                  }}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.84,
                      opacity: isActive ? 1 : 0.45,
                      y: isActive ? -12 : 12,
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative rounded-2xl overflow-hidden aspect-video w-full group border border-white/20 shadow-2xl bg-zinc-900"
                    style={{
                      boxShadow: isActive
                        ? '0 25px 60px -15px rgba(255,255,255,0.25), 0 15px 30px -10px rgba(0,0,0,0.8)'
                        : 'none',
                    }}
                    onClick={() => {
                      if (isActive) {
                        setSelectedVideo(project);
                        setVideoModalOpen(true);
                      } else {
                        scrollTo(index);
                      }
                    }}
                  >
                    {/* Thumbnail */}
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1400&q=80';
                      }}
                    />

                    {/* Dimming overlay on non-active slides */}
                    <div
                      className="absolute inset-0 bg-black transition-opacity duration-500"
                      style={{ opacity: isActive ? 0.15 : 0.65 }}
                    />

                    {/* Gradient overlay on active slide */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    )}

                    {/* Play Button Icon on Hover / Active */}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 text-black fill-black ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Card Information */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                          <div>
                            <span className="text-zinc-300 text-xs sm:text-sm font-semibold tracking-wider uppercase block mb-1">
                              {project.client} · {project.category}
                            </span>
                            <h3 className="text-white text-lg sm:text-2xl font-bold leading-tight">
                              {project.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-300 text-xs sm:text-sm shrink-0">
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                              {project.duration}
                            </span>
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                              {project.views.toLocaleString()} views
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Small duration badge when not active */}
                    {!isActive && project.duration && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-white">
                        {project.duration}
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation Controls (Left, Dots, Right) */}
        <div className="flex justify-between items-center px-4 sm:px-8 mt-6 max-w-4xl mx-auto">
          <button
            onClick={scrollPrev}
            aria-label="Previous Slide"
            className="flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 shadow-xl active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? 'w-7 h-2 bg-white'
                    : 'w-2 h-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            aria-label="Next Slide"
            className="flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 shadow-xl active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Action Buttons for Current Slide */}
        {projects[selectedIndex] && (
          <div className="flex justify-center gap-4 mt-8 px-4">
            <button
              onClick={() => {
                setSelectedVideo(projects[selectedIndex]);
                setVideoModalOpen(true);
              }}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 active:scale-95 transition-all shadow-lg text-sm sm:text-base"
            >
              <Play className="w-4 h-4 fill-black" />
              Watch Video
            </button>
            <a
              href={projects[selectedIndex].videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 bg-zinc-900 border border-zinc-700 text-white font-medium rounded-full hover:bg-zinc-800 active:scale-95 transition-all text-sm sm:text-base"
            >
              {getPlatformIcon(projects[selectedIndex].type)}
              Open on YouTube
            </a>
          </div>
        )}
      </div>

      {/* Cinematic Video Modal */}
      <AnimatePresence>
        {videoModalOpen && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(20px)' }}
            onClick={() => {
              setVideoModalOpen(false);
              setSelectedVideo(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full flex flex-col"
              style={{ maxWidth: 'min(95vw, 1050px)' }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setVideoModalOpen(false);
                  setSelectedVideo(null);
                }}
                className="self-end mb-3 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors group"
              >
                <span className="text-sm">Close</span>
                <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4" />
                </span>
              </button>

              {/* Video Player Embed */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800">
                <iframe
                  key={selectedVideo.videoId}
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              </div>

              {/* Meta details bar */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    {selectedVideo.client} · {selectedVideo.category}
                  </p>
                  <h3 className="text-white text-lg sm:text-xl font-bold">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.description && (
                    <p className="text-zinc-400 text-sm mt-1 max-w-2xl">{selectedVideo.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    {getPlatformIcon(selectedVideo.type)}
                    Open Link
                  </a>
                  <button
                    onClick={() => {
                      setVideoModalOpen(false);
                      setSelectedVideo(null);
                    }}
                    className="px-5 py-2.5 bg-zinc-900 border border-zinc-700 text-white text-sm rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}