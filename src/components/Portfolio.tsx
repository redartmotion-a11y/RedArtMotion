import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Youtube, FileVideo, Globe, ChevronLeft, ChevronRight, Sparkles, ExternalLink, Eye, Clock, Flame } from 'lucide-react';
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
    description: 'Dynamic pacing, custom captions, kinetic typography, and sound design crafted for high-retention social media.',
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
  const [activeCategory, setActiveCategory] = useState<string>('All');
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

  // Unique categories for filter pills
  const categories = useMemo(() => {
    const valid = Array.isArray(projects)
      ? projects.filter((p) => p && typeof p === 'object')
      : DEFAULT_REAL_PROJECTS;
    const rawCategories = Array.from(new Set(valid.map((p) => p.category))).filter(Boolean);
    return ['All', ...rawCategories];
  }, [projects]);

  // Filtered projects based on active category
  const filteredProjects = useMemo(() => {
    const valid = Array.isArray(projects)
      ? projects.filter((p) => p && typeof p === 'object')
      : [];
    const list = valid.length > 0 ? valid : DEFAULT_REAL_PROJECTS;
    if (activeCategory === 'All') return list;
    const filtered = list.filter((p) => p.category === activeCategory);
    return filtered.length > 0 ? filtered : list;
  }, [projects, activeCategory]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: filteredProjects.length > 1,
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
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect, filteredProjects]);

  // Reset to first slide when category changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
      setSelectedIndex(0);
    }
  }, [activeCategory, emblaApi]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (videoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [videoModalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && videoModalOpen) {
        setVideoModalOpen(false);
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoModalOpen]);

  const API_URL =
    'https://script.google.com/macros/s/AKfycbyyiRvJDdHqKHoG8CSEx0EOvycD8aK99S8cRle3yVoqFyso4D7DqZqluBpfjxtG09Ki/exec';

  const getPlatformIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'drive':
      case 'google drive':
        return <FileVideo className="w-4 h-4 text-blue-400" />;
      default:
        return <Globe className="w-4 h-4 text-purple-400" />;
    }
  };

  const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    if (url.length === 11 && !url.includes('/')) return url;
    const patterns = [
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
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
      const timeout = setTimeout(() => controller.abort(), 6000);
      let videosRaw: any[] = [];

      try {
        const res = await fetch(`${API_URL}?action=getVideos`, { signal: controller.signal });
        const data = await res.json();
        if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
          videosRaw = data.videos;
        }
      } catch {}

      // Fallback to getHeroVideos if getVideos fails or has no videos
      if (videosRaw.length === 0) {
        try {
          const resHero = await fetch(`${API_URL}?action=getHeroVideos`, { signal: controller.signal });
          const dataHero = await resHero.json();
          if (dataHero.success && Array.isArray(dataHero.videos) && dataHero.videos.length > 0) {
            videosRaw = dataHero.videos;
          }
        } catch {}
      }

      clearTimeout(timeout);

      if (videosRaw.length > 0) {
        const list = videosRaw.map((v: any) => processVideoData(v));
        setProjects(list);
        localStorage.setItem('portfolioVideos', JSON.stringify(list));
      }
    } catch {
      // Silently fall back to current projects
    }
  };

  useEffect(() => {
    fetchProjects();
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('portfolioVideos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed);
        }
      } catch {}
    };
    window.addEventListener('portfolioVideosUpdated', handleUpdate);
    return () => window.removeEventListener('portfolioVideosUpdated', handleUpdate);
  }, []);

  const currentProject = filteredProjects[selectedIndex] || filteredProjects[0] || DEFAULT_REAL_PROJECTS[0];

  return (
    <section id="portfolio" className="py-20 sm:py-32 bg-zinc-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/15 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12 px-4 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white mb-4 backdrop-blur-md shadow-inner">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span className="text-xs sm:text-sm font-medium tracking-wide">Featured Works</span>
        </div>
        <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Our Recent Projects
        </h2>
        <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto">
          Swipe or click through our high-retention video edits, kinetic typography, and motion design masterpieces.
        </p>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6 sm:mt-8 max-w-2xl mx-auto">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                      : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Swipeable Carousel */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        {/* Embla viewport */}
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{ padding: '20px 0' }}
          ref={emblaRef}
        >
          <div
            className="flex touch-pan-y items-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {filteredProjects.map((project, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  key={project.id}
                  className="portfolio-slide-item"
                  style={{
                    minWidth: 0,
                  }}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.88,
                      opacity: isActive ? 1 : 0.45,
                      y: isActive ? -4 : 4,
                    }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`relative rounded-2xl sm:rounded-3xl overflow-hidden w-full group bg-zinc-900 cursor-pointer transition-shadow duration-300 ${
                      isActive ? 'portfolio-card-glow' : 'hover:opacity-75'
                    }`}
                    style={{
                      aspectRatio: '16 / 9',
                      border: isActive ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.08)',
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
                    {/* Thumbnail Image */}
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1400&q=80';
                      }}
                    />

                    {/* Non-active dimming veil */}
                    <div
                      className="absolute inset-0 bg-black transition-opacity duration-300"
                      style={{ opacity: isActive ? 0.2 : 0.65 }}
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                    {/* Top Badges (Category & Duration) */}
                    <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 flex items-center justify-between z-10 pointer-events-none">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs text-white font-medium shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>{project.category}</span>
                      </div>

                      {project.duration && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs text-zinc-300 font-mono shadow-lg">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span>{project.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div
                        className={`relative rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'w-11 h-11 sm:w-16 sm:h-16 bg-white/95 text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] group-hover:scale-110 group-hover:bg-white'
                            : 'w-8 h-8 sm:w-10 sm:h-10 bg-black/60 text-white/80 border border-white/20 group-hover:scale-105'
                        }`}
                      >
                        <Play
                          className={`fill-current ml-0.5 ${
                            isActive ? 'w-5 h-5 sm:w-7 sm:h-7 text-black' : 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-white'
                          }`}
                        />
                        {isActive && (
                          <div
                            className="absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none"
                            style={{ animationDuration: '2.5s' }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Bottom Card Information */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-10">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-3">
                        <div className="max-w-md">
                          <span className="text-red-400 text-[11px] sm:text-xs font-semibold tracking-wider uppercase block mb-0.5">
                            {project.client} · {project.category}
                          </span>
                          <h3 className="text-white text-sm sm:text-lg lg:text-xl font-bold tracking-tight leading-snug drop-shadow-md portfolio-line-clamp-1 sm:portfolio-line-clamp-2">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-zinc-300 text-[11px] sm:text-xs mt-0.5 portfolio-line-clamp-1 opacity-90 hidden sm:block">
                              {project.description}
                            </p>
                          )}
                        </div>

                        {/* Stats Badges */}
                        <div className="flex items-center gap-2 text-zinc-300 text-xs sm:text-sm shrink-0">
                          {Number(project.views || 0) > 0 && (
                            <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 flex items-center gap-1.5 font-medium">
                              <Eye className="w-3.5 h-3.5 text-red-400" />
                              {Number(project.views).toLocaleString()} views
                            </span>
                          )}
                          {Number(project.engagement || 0) > 0 && (
                            <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 flex items-center gap-1.5 font-medium hidden xs:flex">
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                              {project.engagement}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation Controls (Left, Dots, Right) */}
        <div className="flex justify-between items-center px-4 sm:px-8 mt-4 sm:mt-6 max-w-3xl mx-auto">
          <button
            onClick={scrollPrev}
            aria-label="Previous Slide"
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-900 border border-zinc-700/80 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-xl active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? 'w-7 sm:w-8 h-2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    : 'w-2 h-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            aria-label="Next Slide"
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-900 border border-zinc-700/80 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-xl active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Action Buttons for Current Active Slide */}
        {currentProject && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-6 px-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => {
                setSelectedVideo(currentProject);
                setVideoModalOpen(true);
              }}
              className="px-5 sm:px-7 py-2.5 sm:py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_8px_20px_-5px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Watch Video</span>
            </button>
            <a
              href={currentProject.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-7 py-2.5 sm:py-3 bg-zinc-900/90 border border-zinc-700 hover:border-zinc-500 text-white font-medium rounded-full hover:bg-zinc-800 active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {getPlatformIcon(currentProject.type)}
              <span>Open on YouTube</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
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
              {/* Close Button Bar */}
              <div className="flex items-center justify-between mb-3 text-zinc-400 text-xs sm:text-sm">
                <span className="font-semibold text-white tracking-wide uppercase">
                  {selectedVideo.client} · {selectedVideo.category}
                </span>
                <button
                  onClick={() => {
                    setVideoModalOpen(false);
                    setSelectedVideo(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <span className="text-xs font-medium">Close</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player Embed */}
              <div
                className="w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800"
                style={{ aspectRatio: '16 / 9' }}
              >
                <iframe
                  key={selectedVideo.videoId}
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              </div>

              {/* Meta Details Bar */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-4 sm:p-5 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="max-w-2xl">
                  <h3 className="text-white text-base sm:text-xl font-bold leading-tight">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.description && (
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    {getPlatformIcon(selectedVideo.type)}
                    <span>Open Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      setVideoModalOpen(false);
                      setSelectedVideo(null);
                    }}
                    className="px-5 py-2.5 bg-zinc-800 border border-zinc-700 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Done
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