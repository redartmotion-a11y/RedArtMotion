import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, RefreshCw, Youtube, FileVideo, Globe } from 'lucide-react';

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
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const API_URL = 'https://script.google.com/macros/s/AKfycbzPW0PvdToWVJ2qw3TSHBDPTJB_gv16eUUEytpCi_rqJJAeySK1KZDYWWU3UIrcELNI/exec';

  // Function to get video platform icon
  const getPlatformIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'drive':
      case 'google drive':
        return <FileVideo className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  // Function to extract video ID and generate appropriate URL/thumbnail
  const processVideoData = (video: any): Project => {
    let videoId = video.videoId || '';
    let thumbnail = '';
    let videoUrl = '#';
    let type = video.type || 'YouTube';

    // Process based on video type
    switch (type.toLowerCase()) {
      case 'youtube':
        const ytId = extractYouTubeId(videoId);
        videoId = ytId;
        thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';
        videoUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : '#';
        break;

      case 'drive':
      case 'google drive':
        // Google Drive video - we need to extract file ID
        const driveId = extractGoogleDriveId(videoId);
        videoId = driveId;
        thumbnail = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000` : '';
        videoUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : '#';
        break;

      case 'vimeo':
        const vimeoId = extractVimeoId(videoId);
        videoId = vimeoId;
        thumbnail = vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : '';
        videoUrl = vimeoId ? `https://vimeo.com/${vimeoId}` : '#';
        break;

      case 'tiktok':
        thumbnail = '/api/placeholder/400/225';
        videoUrl = videoId.startsWith('http') ? videoId : `https://tiktok.com/@${videoId}`;
        break;

      case 'instagram':
        thumbnail = '/api/placeholder/400/225';
        videoUrl = videoId.startsWith('http') ? videoId : `https://instagram.com/p/${videoId}`;
        break;

      case 'custom':
      default:
        thumbnail = videoId.startsWith('http') ? videoId : '/api/placeholder/400/225';
        videoUrl = videoId.startsWith('http') ? videoId : '#';
        break;
    }

    // Fallback thumbnail if none generated
    if (!thumbnail) {
      thumbnail = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80';
    }

    return {
      id: video.id,
      title: video.title || 'Untitled',
      description: video.description || '',
      videoId: videoId,
      category: (video.category === 'Video Editing' ? 'Short Form' : video.category) || 'Short Form',
      client: video.client || '',
      duration: video.duration || '',
      type: type,
      videoLength: video.videoLength || '',
      views: video.views || 0,
      engagement: video.engagement || 0,
      thumbnail: thumbnail,
      videoUrl: videoUrl
    };
  };

  // Extract YouTube ID
  const extractYouTubeId = (url: string): string => {
    if (!url) return '';

    // If it's already just an ID
    if (url.length === 11 && !url.includes('/')) {
      return url;
    }

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return '';
  };

  // Extract Google Drive ID
  const extractGoogleDriveId = (url: string): string => {
    if (!url) return '';

    // Direct file ID
    if (url.length >= 20 && !url.includes('/')) {
      return url;
    }

    // Extract from Google Drive URL
    const patterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
      /^([a-zA-Z0-9_-]{20,})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return '';
  };

  // Extract Vimeo ID
  const extractVimeoId = (url: string): string => {
    if (!url) return '';

    // Direct ID
    if (/^\d+$/.test(url)) {
      return url;
    }

    // Extract from Vimeo URL
    const pattern = /vimeo\.com\/(\d+)/;
    const match = url.match(pattern);

    return match ? match[1] : '';
  };

  // Fetch projects from Google Sheets API
  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}?action=getVideos`);
      const data = await response.json();

      if (data.success && data.videos) {
        // Process each video to generate proper URLs and thumbnails
        const transformedProjects = data.videos.map((video: any) =>
          processVideoData(video)
        );

        setProjects(transformedProjects);

        // Save to localStorage as backup
        localStorage.setItem('portfolioVideos', JSON.stringify(transformedProjects));

        // Generate dynamic filters from categories
        updateFilters(transformedProjects);
      } else {
        throw new Error(data.message || 'API Error');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Error loading videos');
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Update filters based on available categories
  const updateFilters = (projectsList: Project[]) => {
    const categories = Array.from(new Set(projectsList.map(p => p.category)))
      .filter(Boolean) as string[];

    // Update filters state if needed
    if (categories.length > 0 && !categories.includes(activeFilter) && activeFilter !== 'All') {
      setActiveFilter('All');
    }
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    const savedVideos = localStorage.getItem('portfolioVideos');
    if (savedVideos) {
      try {
        const parsed = JSON.parse(savedVideos);
        setProjects(parsed);
        updateFilters(parsed);
      } catch (e) {
        setProjects(getDefaultProjects());
      }
    } else {
      setProjects(getDefaultProjects());
    }
  };

  // Get default projects
  const getDefaultProjects = (): Project[] => {
    return [
      {
        id: '1',
        title: 'SaaS Explainer Video',
        description: 'An explainer video for a SaaS startup',
        videoId: 'dQw4w9WgXcQ',
        category: 'Short Form',
        client: 'Tech Startup',
        duration: '2:30',
        type: 'YouTube',
        videoLength: '150',
        views: 12500,
        engagement: 85,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: '2',
        title: 'Motion Design Logo',
        description: 'Logo animation in motion design',
        videoId: 'example2',
        category: 'Motion Design',
        client: 'Creative Agency',
        duration: '0:45',
        type: 'YouTube',
        videoLength: '45',
        views: 8500,
        engagement: 92,
        thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=example2'
      },
      {
        id: '3',
        title: 'Tech Startup Ad',
        description: 'Advertisement for a tech startup',
        videoId: 'example3',
        category: 'Explainer Videos',
        client: 'Tech Corp',
        duration: '1:15',
        type: 'YouTube',
        videoLength: '75',
        views: 21500,
        engagement: 78,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=example3'
      }
    ];
  };

  // Get dynamic filters
  const getFilters = () => {
    const categories = Array.from(new Set(projects.map(p => p.category)))
      .filter(Boolean) as string[];
    return ['All', ...categories];
  };

  // Filter projects
  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  // Handle video click
  const handleVideoClick = (project: Project) => {
    setSelectedVideo(project);
    setVideoModalOpen(true);
  };

  // Close video modal
  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setSelectedVideo(null);
  };

  // Initial load
  useEffect(() => {
    fetchProjects();

    // Listen for portfolio refresh from admin panel
    const handlePortfolioRefresh = () => {
      fetchProjects();
    };

    window.addEventListener('portfolioRefresh', handlePortfolioRefresh);

    return () => {
      window.removeEventListener('portfolioRefresh', handlePortfolioRefresh);
    };
  }, []);

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white mb-4">
            <RefreshCw className="w-4 h-4" />
            Dynamic Portfolio
          </div>
          <h2 className="text-white mb-4">
            Our Work
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            Discover our recent projects - YouTube, Drive, Vimeo, TikTok, and more
          </p>

          {/* Loading/Error State */}
          <div className="mt-4">
            {loading && (
              <div className="inline-flex items-center gap-2 text-zinc-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading videos...
              </div>
            )}
            {error && !loading && (
              <div className="inline-flex items-center gap-2 text-red-400">
                <span>{error}</span>
                <button
                  onClick={fetchProjects}
                  className="text-white underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {getFilters().map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${activeFilter === filter
                ? 'bg-white text-black font-medium'
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-zinc-400 text-lg">
                No videos in the "{activeFilter}" category
              </p>
              {activeFilter !== 'All' && (
                <button
                  onClick={() => setActiveFilter('All')}
                  className="mt-4 text-white underline hover:no-underline"
                >
                  View all videos
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => handleVideoClick(project)}>
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                    {/* Platform Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
                      {getPlatformIcon(project.type)}
                      <span className="capitalize">{project.type}</span>
                    </div>

                    {/* Duration Badge */}
                    {project.duration && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
                        {project.duration}
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-white/50 transform group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-black fill-black ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white text-lg font-medium line-clamp-1 flex-1">
                        {project.title}
                      </h3>
                    </div>

                    {/* Client and Stats */}
                    <div className="flex items-center justify-between mb-3">
                      {project.client && (
                        <span className="text-purple-400 text-sm">
                          {project.client}
                        </span>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-zinc-500 text-sm">
                        {project.views > 0 && (
                          <span>{project.views.toLocaleString()} views</span>
                        )}
                        {project.engagement > 0 && (
                          <span>{project.engagement}% engagement</span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800/50 rounded-full text-zinc-300 text-sm">
                        {project.category}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVideoClick(project)}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                        >
                          <Play className="w-4 h-4" />
                          Watch
                        </button>
                        <a
                          href={project.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <X className="w-4 h-4" />
                          Original
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Modal */}
        <AnimatePresence>
          {videoModalOpen && selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={closeVideoModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                  <div>
                    <h3 className="text-white text-xl">{selectedVideo.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-zinc-400 text-sm">{selectedVideo.client}</span>
                      <span className="text-purple-400 text-sm">{selectedVideo.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={closeVideoModal}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Video Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="aspect-video mb-6 bg-black rounded-lg overflow-hidden">
                    {selectedVideo.type.toLowerCase() === 'drive' ? (
                      <iframe
                        src={`https://drive.google.com/file/d/${selectedVideo.videoId}/preview`}
                        className="w-full h-full"
                        allow="autoplay"
                        title={selectedVideo.title}
                      />
                    ) : selectedVideo.type.toLowerCase() === 'youtube' ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={selectedVideo.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <p>Watch the video on the original platform</p>
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="space-y-4">
                    {selectedVideo.description && (
                      <div>
                        <h4 className="text-white mb-2">Description</h4>
                        <p className="text-zinc-400">{selectedVideo.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <p className="text-zinc-400 text-sm">Type</p>
                        <p className="text-white">{selectedVideo.type}</p>
                      </div>
                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <p className="text-zinc-400 text-sm">Duration</p>
                        <p className="text-white">{selectedVideo.duration || 'N/A'}</p>
                      </div>
                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <p className="text-zinc-400 text-sm">Views</p>
                        <p className="text-white">{selectedVideo.views.toLocaleString()}</p>
                      </div>
                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <p className="text-zinc-400 text-sm">Engagement</p>
                        <p className="text-white">{selectedVideo.engagement}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-zinc-800">
                  <div className="flex justify-between items-center">
                    <a
                      href={selectedVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      {getPlatformIcon(selectedVideo.type)}
                      Open on {selectedVideo.type}
                    </a>
                    <button
                      onClick={closeVideoModal}
                      className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refresh Button */}
        <div className="mt-12 text-center">
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Videos'}
          </button>
          <p className="text-zinc-500 text-sm mt-2">
            {projects.length} videos available • Supports: YouTube, Drive, Vimeo, TikTok, Instagram
          </p>
        </div>
      </div>
    </section>
  );
}