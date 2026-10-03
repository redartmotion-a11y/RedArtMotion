import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, RefreshCw, Youtube, FileVideo, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
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

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedVideo, setSelectedVideo] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const API_URL = 'https://script.google.com/macros/s/AKfycbznAIw4RryxWGoSeKqO6x-xRZhKZqyMCUb_3vO8OnN6u83GU6JQI9QkbI5NsAMBqUc2tQ/exec';

  const getPlatformIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'drive':
      case 'google drive': return <FileVideo className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
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

  const extractGoogleDriveId = (url: string): string => {
    if (!url) return '';
    if (url.length >= 20 && !url.includes('/')) return url;
    const patterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
      /^([a-zA-Z0-9_-]{20,})$/,
    ];
    for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
    return '';
  };

  const extractVimeoId = (url: string): string => {
    if (!url) return '';
    if (/^\d+$/.test(url)) return url;
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : '';
  };

  const processVideoData = (video: any): Project => {
    let videoId = video.videoId || '';
    let thumbnail = '';
    let videoUrl = '#';
    let type = video.type || 'YouTube';

    switch (type.toLowerCase()) {
      case 'youtube': {
        const id = extractYouTubeId(videoId);
        videoId = id;
        thumbnail = id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
        videoUrl = id ? `https://www.youtube.com/watch?v=${id}` : '#';
        break;
      }
      case 'drive':
      case 'google drive': {
        const id = extractGoogleDriveId(videoId);
        videoId = id;
        thumbnail = id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : '';
        videoUrl = id ? `https://drive.google.com/file/d/${id}/preview` : '#';
        break;
      }
      case 'vimeo': {
        const id = extractVimeoId(videoId);
        videoId = id;
        thumbnail = id ? `https://vumbnail.com/${id}.jpg` : '';
        videoUrl = id ? `https://vimeo.com/${id}` : '#';
        break;
      }
      default:
        thumbnail = videoId.startsWith('http') ? videoId : '';
        videoUrl = videoId.startsWith('http') ? videoId : '#';
    }

    if (!thumbnail) thumbnail = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80';

    return {
      id: video.id, title: video.title || 'Sans titre', description: video.description || '',
      videoId, category: video.category || 'Montage Vidéo', client: video.client || '',
      duration: video.duration || '', type, videoLength: video.videoLength || '',
      views: video.views || 0, engagement: video.engagement || 0, thumbnail, videoUrl,
    };
  };

  const fetchProjects = async (showRetryBanner = false) => {
    setLoading(true);
    if (!showRetryBanner) setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(`${API_URL}?action=getVideos`, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.success && data.videos) {
        const list = data.videos.map((v: any) => processVideoData(v));
        setProjects(list);
        setError('');
        localStorage.setItem('portfolioVideos', JSON.stringify(list));
      } else throw new Error(data.message || 'API error');
    } catch {
      // Silently fall back — load cached or mock data, show subtle retry
      const saved = localStorage.getItem('portfolioVideos');
      const fallback = saved ? JSON.parse(saved) : getDefaultProjects();
      setProjects(fallback);
      setError('retry'); // only triggers the small retry banner
    } finally {
      setLoading(false);
    }
  };

  const getDefaultProjects = (): Project[] => [
    {
      id: '1', title: 'Vidéo Explicative SaaS', description: 'Une vidéo explicative pour une startup SaaS',
      videoId: 'dQw4w9WgXcQ', category: 'Montage Vidéo', client: 'Startup Tech', duration: '2:30',
      type: 'YouTube', videoLength: '150', views: 12500, engagement: 85,
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: '2', title: 'Motion Design Logo', description: 'Animation de logo en motion design',
      videoId: 'example2', category: 'Motion Design', client: 'Agence Creative', duration: '0:45',
      type: 'YouTube', videoLength: '45', views: 8500, engagement: 92,
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=example2',
    },
    {
      id: '3', title: 'Publicité Tech Startup', description: 'Publicité pour une startup technologique',
      videoId: 'example3', category: 'Vidéos Explicatives', client: 'Tech Corp', duration: '1:15',
      type: 'YouTube', videoLength: '75', views: 21500, engagement: 78,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=example3',
    },
    {
      id: '4', title: 'Montage YouTube Premium', description: 'Montage vidéo premium pour YouTubeur',
      videoId: 'example4', category: 'Montage Vidéo', client: 'Creator Pro', duration: '3:00',
      type: 'YouTube', videoLength: '180', views: 35000, engagement: 90,
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=example4',
    },
  ];

  const getFilters = () => {
    const cats = Array.from(new Set(projects.map(p => p.category))).filter(Boolean) as string[];
    return ['Tous', ...cats];
  };

  const filteredProjects = activeFilter === 'Tous' ? projects : projects.filter(p => p.category === activeFilter);

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (emblaApi) { emblaApi.scrollTo(0); setSelectedIndex(0); }
  }, [activeFilter, emblaApi]);

  return (
    <section id="portfolio" className="py-20 sm:py-32 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-transparent to-transparent" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-6">
          <Play className="w-4 h-4 fill-white" />
          Previous Work
        </div>
        <h2 className="text-white text-4xl sm:text-5xl font-bold mb-4">Nos réalisations</h2>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Swipez pour découvrir nos projets
        </p>
        {loading && (
          <div className="inline-flex items-center gap-2 text-zinc-400 mt-4">
            <RefreshCw className="w-4 h-4 animate-spin" /> Chargement...
          </div>
        )}

      </motion.div>



      {/* Full-width Peek Carousel */}
      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 && !loading ? (
          <div className="text-center py-12 px-4">
            <p className="text-zinc-400">Aucune vidéo dans "{activeFilter}"</p>
            {activeFilter !== 'Tous' && (
              <button onClick={() => setActiveFilter('Tous')} className="mt-4 text-white underline">
                Voir tout
              </button>
            )}
          </div>
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Embla viewport — full-bleed, no clip, peek on sides */}
            <div
              className="overflow-hidden"
              style={{ padding: '40px 0' }}
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
                      className="flex-none"
                      style={{
                        /* Active card = 80vw on desktop, 92vw on mobile, max 1100px */
                        width: 'clamp(280px, 82vw, 1100px)',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                      }}
                    >
                      <motion.div
                        animate={{
                          scale:   isActive ? 1    : 0.78,
                          opacity: isActive ? 1    : 0.32,
                          y:       isActive ? -18  : 18,
                        }}
                        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="relative cursor-pointer group rounded-2xl overflow-hidden aspect-video w-full"
                        style={{
                          boxShadow: isActive
                            ? '0 40px 90px -12px rgba(139,92,246,0.6), 0 20px 40px -8px rgba(0,0,0,0.85)'
                            : 'none',
                        }}
                        onClick={() => {
                          if (isActive) { setSelectedVideo(project); setVideoModalOpen(true); }
                          else { scrollTo(index); }
                        }}
                      >
                        {/* Thumbnail */}
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1400&q=80';
                          }}
                        />

                        {/* Dark veil — inactive */}
                        <div
                          className="absolute inset-0 bg-zinc-950 transition-opacity duration-500"
                          style={{ opacity: isActive ? 0 : 0.65 }}
                        />

                        {/* Bottom gradient — active only */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        )}

                        {/* Play button — active hover */}
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black ml-1" />
                            </div>
                          </div>
                        )}

                        {/* Title / meta — active */}
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                            <div className="flex items-end justify-between gap-4">
                              <div>
                                <span className="text-purple-400 text-xs sm:text-sm font-semibold tracking-wide uppercase block mb-1">
                                  {project.client}
                                </span>
                                <h3 className="text-white text-lg sm:text-2xl font-bold leading-snug">
                                  {project.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 text-zinc-300 text-sm shrink-0">
                                {getPlatformIcon(project.type)}
                                {project.duration && <span>{project.duration}</span>}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Duration badge — inactive */}
                        {!isActive && project.duration && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
                            {project.duration}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls row: ← dots → */}
            <div className="flex justify-between items-center px-6 sm:px-12 mt-4">
              <button
                onClick={scrollPrev}
                aria-label="Précédent"
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black hover:border-transparent hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2">
                {scrollSnaps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === selectedIndex
                        ? 'w-7 h-2 bg-white'
                        : 'w-2 h-2 bg-zinc-600 hover:bg-zinc-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={scrollNext}
                aria-label="Suivant"
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black hover:border-transparent hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* CTA below */}
            {filteredProjects[selectedIndex] && (
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center gap-4 mt-8 px-4"
              >
                <button
                  onClick={() => {
                    setSelectedVideo(filteredProjects[selectedIndex]);
                    setVideoModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-7 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 active:scale-95 transition-all duration-200"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Regarder
                </button>
                <a
                  href={filteredProjects[selectedIndex].videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-7 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-full hover:bg-zinc-700 active:scale-95 transition-all duration-200"
                >
                  {getPlatformIcon(filteredProjects[selectedIndex].type)}
                  Original
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CINEMATIC VIDEO MODAL ── */}
      <AnimatePresence>
        {videoModalOpen && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
            onClick={() => { setVideoModalOpen(false); setSelectedVideo(null); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.92, opacity: 0, y: 20  }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full flex flex-col"
              style={{ maxWidth: 'min(95vw, 1100px)' }}
            >
              {/* ── Floating close button ── */}
              <button
                onClick={() => { setVideoModalOpen(false); setSelectedVideo(null); }}
                className="absolute -top-12 right-0 z-10 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors group"
              >
                <span className="text-sm hidden sm:block">Fermer</span>
                <span className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <X className="w-5 h-5" />
                </span>
              </button>

              {/* ── Video player ── */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
                {selectedVideo.type.toLowerCase() === 'youtube' ? (
                  <iframe
                    key={selectedVideo.videoId}
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                ) : selectedVideo.type.toLowerCase() === 'drive' || selectedVideo.type.toLowerCase() === 'google drive' ? (
                  <iframe
                    key={selectedVideo.videoId}
                    src={`https://drive.google.com/file/d/${selectedVideo.videoId}/preview`}
                    className="w-full h-full"
                    allow="autoplay"
                    title={selectedVideo.title}
                  />
                ) : selectedVideo.type.toLowerCase() === 'vimeo' ? (
                  <iframe
                    key={selectedVideo.videoId}
                    src={`https://player.vimeo.com/video/${selectedVideo.videoId}?autoplay=1&title=0&byline=0`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                ) : (
                  /* Fallback: show thumbnail + external link */
                  <div className="relative w-full h-full">
                    <img
                      src={selectedVideo.thumbnail}
                      alt={selectedVideo.title}
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <p className="text-zinc-300 text-sm">Lecture non disponible en intégré</p>
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors font-medium"
                      >
                        {getPlatformIcon(selectedVideo.type)}
                        Ouvrir sur {selectedVideo.type}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Meta bar below player ── */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-1">
                    {selectedVideo.client}{selectedVideo.category ? ` · ${selectedVideo.category}` : ''}
                  </p>
                  <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.description && (
                    <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{selectedVideo.description}</p>
                  )}
                </div>

                {/* Stats chips */}
                <div className="flex gap-3 shrink-0">
                  {selectedVideo.duration && (
                    <span className="px-3 py-1.5 bg-zinc-800 rounded-full text-zinc-300 text-xs">
                      ⏱ {selectedVideo.duration}
                    </span>
                  )}
                  {selectedVideo.views > 0 && (
                    <span className="px-3 py-1.5 bg-zinc-800 rounded-full text-zinc-300 text-xs">
                      👁 {selectedVideo.views.toLocaleString()}
                    </span>
                  )}
                  {selectedVideo.engagement > 0 && (
                    <span className="px-3 py-1.5 bg-zinc-800 rounded-full text-zinc-300 text-xs">
                      💬 {selectedVideo.engagement}%
                    </span>
                  )}
                </div>
              </div>

              {/* ── CTA ── */}
              <div className="mt-5 flex gap-3 px-1">
                <a
                  href={selectedVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 active:scale-95 transition-all font-medium"
                >
                  {getPlatformIcon(selectedVideo.type)}
                  Voir sur {selectedVideo.type}
                </a>
                <button
                  onClick={() => { setVideoModalOpen(false); setSelectedVideo(null); }}
                  className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-full hover:bg-zinc-700 active:scale-95 transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
