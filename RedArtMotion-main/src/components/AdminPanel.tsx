import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Eye, Lock, LogOut, Save, Edit, RefreshCw, Film, LayoutTemplate } from 'lucide-react';

interface Video {
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

type HeroPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface HeroVideo {
  id: string;
  title: string;
  videoId: string;
  position: HeroPosition;
}

const HERO_POSITIONS: HeroPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

const DEFAULT_HERO_VIDEOS: HeroVideo[] = [
  { id: '1', title: 'Motion Reel', videoId: 'dQw4w9WgXcQ', position: 'top-left' },
  { id: '2', title: 'Brand Video', videoId: 'dQw4w9WgXcQ', position: 'top-right' },
  { id: '3', title: 'Social Clip', videoId: 'dQw4w9WgXcQ', position: 'bottom-left' },
  { id: '4', title: 'Ad Film', videoId: 'dQw4w9WgXcQ', position: 'bottom-right' },
];

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'hero'>('portfolio');

  // Hero Videos State
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>(DEFAULT_HERO_VIDEOS);
  const [editingHeroVideo, setEditingHeroVideo] = useState<HeroVideo | null>(null);
  const [newHeroVideo, setNewHeroVideo] = useState<{ title: string; videoId: string; position: HeroPosition }>({
    title: '',
    videoId: '',
    position: 'top-left',
  });

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoId: '',
    category: 'Short Form',
    client: '',
    duration: '',
    type: 'YouTube',
    videoLength: '',
    views: 0,
    engagement: 0
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ADMIN_EMAIL = 'redareda@reda.com';
  const ADMIN_PASSWORD = 'redamotiondevbymehdi';
  const ADMIN_TOKEN = 'reda_admin_token';
  const API_URL = 'https://script.google.com/macros/s/AKfycbyyiRvJDdHqKHoG8CSEx0EOvycD8aK99S8cRle3yVoqFyso4D7DqZqluBpfjxtG09Ki/exec';

  // Fetch videos from Google Sheets
  const fetchVideos = async () => {
    setLoading(true);
    try {
      // FIXED: Using GET parameter correctly
      const response = await fetch(
        `${API_URL}?action=getVideosAdmin&token=${ADMIN_TOKEN}`
      );
      const data = await response.json();
      console.log('Fetched videos:', data); // Debug log

      if (data.success) {
        // Add thumbnail and videoUrl based on videoId
        const videosWithMedia = data.videos.map((video: any) => ({
          ...video,
          category: video.category === 'Video Editing' ? 'Short Form' : video.category,
          thumbnail: video.videoId ? `https://img.youtube.com/vi/${extractYouTubeId(video.videoId)}/hqdefault.jpg` : '',
          videoUrl: video.videoId ? `https://www.youtube.com/watch?v=${extractYouTubeId(video.videoId)}` : ''
        }));
        setVideos(videosWithMedia);
        setError('');
      } else {
        setError(data.message || 'Error loading videos');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Connection error. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch hero videos from Google Sheets
  const fetchHeroVideos = async () => {
    try {
      const response = await fetch(`${API_URL}?action=getHeroVideos`);
      const data = await response.json();
      if (data.success && data.videos && data.videos.length > 0) {
        setHeroVideos(data.videos);
        // Refresh local view
        window.dispatchEvent(new CustomEvent('heroVideosUpdated'));
      }
    } catch (error) {
      console.error('Error fetching hero videos:', error);
    }
  };

  // Load videos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
      fetchHeroVideos();
    }
  }, [isAuthenticated]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#editreda') {
        setIsOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ── Hero Videos Handlers ──────────────────────────────────────────────────
  const saveHeroVideos = async (updated: HeroVideo[]) => {
    setLoading(true);
    setHeroVideos(updated);
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateHeroVideos',
          token: ADMIN_TOKEN,
          videos: updated
        })
      });
      
      setSuccess('✅ Hero videos synced to database!');
      window.dispatchEvent(new CustomEvent('heroVideosUpdated'));
      
      // Verification fetch after delay
      setTimeout(fetchHeroVideos, 1500);
    } catch (error) {
      console.error('Error saving hero videos:', error);
      setError('Failed to sync to database. Changes might be local only.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHeroVideo = () => {
    if (!newHeroVideo.title.trim() || !newHeroVideo.videoId.trim()) {
      setError('Title and Video ID are required');
      return;
    }

    if (heroVideos.length >= 4) {
      setError('Maximum 4 hero videos allowed');
      return;
    }

    // Auto-assign position if the current selection is already taken
    let finalPosition = newHeroVideo.position;
    const takenPositions = heroVideos.map(v => v.position);
    if (takenPositions.includes(finalPosition)) {
      const available = HERO_POSITIONS.find(p => !takenPositions.includes(p));
      if (available) finalPosition = available;
    }

    const updated = [
      ...heroVideos,
      { ...newHeroVideo, position: finalPosition, id: Date.now().toString() },
    ].slice(0, 4);
    
    saveHeroVideos(updated);
    
    // Set default position for next video to the first available one
    const newTaken = updated.map(v => v.position);
    const next = HERO_POSITIONS.find(p => !newTaken.includes(p)) || 'top-left';
    setNewHeroVideo({ title: '', videoId: '', position: next });
    setSuccess(`✅ Hero video added to ${finalPosition.replace('-', ' ')}!`);
  };

  const handleUpdateHeroVideo = () => {
    if (!editingHeroVideo) return;
    if (!editingHeroVideo.title.trim() || !editingHeroVideo.videoId.trim()) {
      setError('Title and Video ID are required');
      return;
    }
    const updated = heroVideos.map((v) => v.id === editingHeroVideo.id ? editingHeroVideo : v);
    saveHeroVideos(updated);
    setEditingHeroVideo(null);
    setSuccess('✅ Hero video updated!');
  };

  const handleDeleteHeroVideo = (id: string) => {
    if (!confirm('Delete this hero video?')) return;
    const updated = heroVideos.filter((v) => v.id !== id);
    saveHeroVideos(updated);
    setSuccess('✅ Hero video deleted!');
  };

  const handleResetHeroVideos = () => {
    if (!confirm('Reset to default hero videos?')) return;
    saveHeroVideos(DEFAULT_HERO_VIDEOS);
    setSuccess('✅ Hero videos reset to defaults!');
  };

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setError('Incorrect email or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setIsOpen(false);
    setVideos([]);
    setNewVideo({
      title: '',
      description: '',
      videoId: '',
      category: 'Short Form',
      client: '',
      duration: '',
      type: 'YouTube',
      videoLength: '',
      views: 0,
      engagement: 0
    });
    setEditingVideo(null);
    setError('');
    setSuccess('');
    window.location.hash = '';
  };

  const handleAddVideo = async () => {
    if (!newVideo.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!newVideo.videoId.trim()) {
      setError('Video ID is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Adding video:', newVideo); // Debug log

      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', // FIXED: Add no-cors mode for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'addVideo',
          token: ADMIN_TOKEN,
          title: newVideo.title,
          description: newVideo.description,
          videoId: newVideo.videoId,
          category: newVideo.category,
          client: newVideo.client,
          duration: newVideo.duration,
          type: newVideo.type,
          videoLength: newVideo.videoLength,
          views: newVideo.views,
          engagement: newVideo.engagement
        })
      });

      // FIXED: Handle response differently for no-cors mode
      console.log('Response status:', response.status);

      // Since we're using no-cors, we can't read the response
      // But we can assume it worked if no error
      setSuccess('✅ Video added successfully');

      // Reset form
      setNewVideo({
        title: '',
        description: '',
        videoId: '',
        category: 'Short Form',
        client: '',
        duration: '',
        type: 'YouTube',
        videoLength: '',
        views: 0,
        engagement: 0
      });

      // Refresh videos list after a short delay
      setTimeout(() => {
        fetchVideos();
      }, 1000);

      // Notify portfolio to refresh
      window.dispatchEvent(new CustomEvent('portfolioRefresh'));

    } catch (error) {
      console.error('Error adding video:', error);
      setError('Error while adding. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVideo = async () => {
    if (!editingVideo) return;

    if (!editingVideo.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!editingVideo.videoId.trim()) {
      setError('Video ID is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Updating video:', editingVideo);

      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'updateVideo',
          token: ADMIN_TOKEN,
          id: editingVideo.id,
          title: editingVideo.title,
          description: editingVideo.description,
          videoId: editingVideo.videoId,
          category: editingVideo.category,
          client: editingVideo.client,
          duration: editingVideo.duration,
          type: editingVideo.type,
          videoLength: editingVideo.videoLength,
          views: editingVideo.views,
          engagement: editingVideo.engagement
        })
      });

      console.log('Update response status:', response.status);

      setSuccess('✅ Video updated successfully');
      setEditingVideo(null);

      // Refresh videos list
      setTimeout(() => {
        fetchVideos();
      }, 1000);

      window.dispatchEvent(new CustomEvent('portfolioRefresh'));

    } catch (error) {
      console.error('Error updating video:', error);
      setError('Error while updating');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Deleting video ID:', id);

      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'deleteVideo',
          token: ADMIN_TOKEN,
          id: id
        })
      });

      console.log('Delete response status:', response.status);

      setSuccess('✅ Video deleted successfully');

      // Refresh videos list
      setTimeout(() => {
        fetchVideos();
      }, 1000);

      window.dispatchEvent(new CustomEvent('portfolioRefresh'));

    } catch (error) {
      console.error('Error deleting video:', error);
      setError('Error while deleting');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    // Clear new video form
    setNewVideo({
      title: '',
      description: '',
      videoId: '',
      category: 'Short Form',
      client: '',
      duration: '',
      type: 'YouTube',
      videoLength: '',
      views: 0,
      engagement: 0
    });
    // Scroll to form
    const formElement = document.getElementById('video-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingVideo(null);
    window.location.hash = '';
  };

  const resetForm = () => {
    setNewVideo({
      title: '',
      description: '',
      videoId: '',
      category: 'Short Form',
      client: '',
      duration: '',
      type: 'YouTube',
      videoLength: '',
      views: 0,
      engagement: 0
    });
    setEditingVideo(null);
    setError('');
    setSuccess('');
  };

  // Test API connection
  const testConnection = async () => {
    try {
      console.log('Testing connection to:', API_URL);
      const response = await fetch(`${API_URL}?action=getVideos`);
      const data = await response.json();
      console.log('Connection test result:', data);
      return data.success;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  };

  // Test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-500" />
              <h2 className="text-white text-2xl">Admin Panel - Video Portfolio</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!isAuthenticated ? (
              // Login Form
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <Lock className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-white text-xl mb-2">Admin Login</h3>
                  <p className="text-zinc-400">Please log in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-zinc-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Log In
                  </button>
                </form>
              </div>
            ) : (
              // Admin Dashboard
              <div className="space-y-8">
                {/* Tabs */}
                <div className="flex gap-1 bg-zinc-800/60 p-1 rounded-xl w-fit">
                  <button
                    onClick={() => { setActiveTab('portfolio'); setError(''); setSuccess(''); }}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === 'portfolio'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    Portfolio Videos
                  </button>
                  <button
                    onClick={() => { setActiveTab('hero'); setError(''); setSuccess(''); }}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === 'hero'
                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <LayoutTemplate className="w-4 h-4" />
                    Hero Videos
                  </button>
                </div>
                {/* ── Shared Messages ── */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

                {/* ── Portfolio Tab ── */}
                {activeTab === 'portfolio' && (<div className="space-y-6">
                {/* Header with actions */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white text-xl">Portfolio Management</h3>
                    <p className="text-zinc-400 text-sm">{videos.length} videos in database</p>
                    <p className="text-zinc-500 text-xs mt-1">
                      API: {API_URL.substring(0, 30)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={fetchVideos}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>

                {/* Video Form */}
                <div id="video-form" className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                  <h4 className="text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    {editingVideo ? 'Edit video' : 'Add a video'}
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Title *</label>
                      <input
                        type="text"
                        value={editingVideo ? editingVideo.title : newVideo.title}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, title: e.target.value })
                          : setNewVideo({ ...newVideo, title: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Video name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Description</label>
                      <textarea
                        value={editingVideo ? editingVideo.description : newVideo.description}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, description: e.target.value })
                          : setNewVideo({ ...newVideo, description: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Video description"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Video ID / URL YouTube *</label>
                      <input
                        type="text"
                        value={editingVideo ? editingVideo.videoId : newVideo.videoId}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, videoId: e.target.value })
                          : setNewVideo({ ...newVideo, videoId: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="dQw4w9WgXcQ or YouTube URL"
                        required
                      />
                      <p className="text-zinc-500 text-xs mt-1">
                       </p>
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Category</label>
                      <select
                        value={editingVideo ? editingVideo.category : newVideo.category}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, category: e.target.value })
                          : setNewVideo({ ...newVideo, category: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option>Short Form</option>
                        <option>Motion Design</option>
                        <option>Explainer Videos</option>
                        <option>Color Grading</option>
                        <option>Advertising</option>
                        <option>Animation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Client</label>
                      <input
                        type="text"
                        value={editingVideo ? editingVideo.client : newVideo.client}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, client: e.target.value })
                          : setNewVideo({ ...newVideo, client: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Client name"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Duration</label>
                      <input
                        type="text"
                        value={editingVideo ? editingVideo.duration : newVideo.duration}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, duration: e.target.value })
                          : setNewVideo({ ...newVideo, duration: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="2:30"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Type</label>
                      <select
                        value={editingVideo ? editingVideo.type : newVideo.type}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, type: e.target.value })
                          : setNewVideo({ ...newVideo, type: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option>YouTube</option>
                        <option>Vimeo</option>
                        <option>Instagram</option>
                        <option>TikTok</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Length (seconds)</label>
                      <input
                        type="number"
                        value={editingVideo ? editingVideo.videoLength : newVideo.videoLength}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, videoLength: e.target.value })
                          : setNewVideo({ ...newVideo, videoLength: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Views</label>
                      <input
                        type="number"
                        value={editingVideo ? editingVideo.views : newVideo.views}
                        onChange={(e) => editingVideo
                          ? setEditingVideo({ ...editingVideo, views: parseInt(e.target.value) || 0 })
                          : setNewVideo({ ...newVideo, views: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="1000"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-2 text-sm">Engagement (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingVideo ? editingVideo.engagement : newVideo.engagement}
                        onChange={(e) => {
                          const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          editingVideo
                            ? setEditingVideo({ ...editingVideo, engagement: value })
                            : setNewVideo({ ...newVideo, engagement: value })
                        }}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="85"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {editingVideo ? (
                      <>
                        <button
                          onClick={handleUpdateVideo}
                          disabled={loading}
                          className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-6 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all duration-300"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleAddVideo}
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Adding...' : 'Add Video'}
                      </button>
                    )}
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all duration-300"
                      disabled={loading}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Videos List */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white">Current Videos ({videos.length})</h4>
                    {loading && (
                      <div className="text-zinc-400 text-sm flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    )}
                  </div>

                  {videos.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      {loading ? 'Loading videos...' : 'No videos in database. Add one!'}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 group hover:border-zinc-600 transition-colors"
                        >
                          <div className="flex gap-4">
                            <img
                              src={video.thumbnail || 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80'}
                              alt={video.title}
                              className="w-24 h-16 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80';
                              }}
                            />
                            <div className="flex-1">
                              <h5 className="text-white text-sm mb-1 font-medium">{video.title}</h5>
                              <p className="text-zinc-500 text-xs mb-1">{video.category}</p>
                              {video.client && (
                                <p className="text-zinc-600 text-xs mb-1">
                                  Client: {video.client}
                                </p>
                              )}
                              {(video.views > 0 || video.engagement > 0) && (
                                <p className="text-zinc-600 text-xs mb-2">
                                  {video.views > 0 && `${video.views} views`}
                                  {video.views > 0 && video.engagement > 0 && ' • '}
                                  {video.engagement > 0 && `${video.engagement}% engagement`}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <a
                                  href={video.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300 transition-colors"
                                  title="View video"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={() => handleEditVideo(video)}
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                  title="Modifier"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(video.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </div>)}

                {/* ── Hero Videos Tab ───────────────────────────────────── */}
                {activeTab === 'hero' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white text-xl">Hero Section Videos</h3>
                        <p className="text-zinc-400 text-sm mt-1">
                          Manage the 4 floating video cards shown in the hero. Saved locally.
                        </p>
                      </div>
                      <button
                        onClick={handleResetHeroVideos}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reset Defaults
                      </button>
                    </div>

                    {/* Add / Edit Form */}
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                      <h4 className="text-white mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        {editingHeroVideo ? 'Edit Hero Video' : 'Add Hero Video'}
                      </h4>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-zinc-300 mb-2 text-sm">Title *</label>
                          <input
                            type="text"
                            value={editingHeroVideo ? editingHeroVideo.title : newHeroVideo.title}
                            onChange={(e) => editingHeroVideo
                              ? setEditingHeroVideo({ ...editingHeroVideo, title: e.target.value })
                              : setNewHeroVideo({ ...newHeroVideo, title: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                            placeholder="Motion Reel"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-300 mb-2 text-sm">Video ID / URL *</label>
                          <input
                            type="text"
                            value={editingHeroVideo ? editingHeroVideo.videoId : newHeroVideo.videoId}
                            onChange={(e) => editingHeroVideo
                              ? setEditingHeroVideo({ ...editingHeroVideo, videoId: e.target.value })
                              : setNewHeroVideo({ ...newHeroVideo, videoId: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                            placeholder="dQw4w9WgXcQ or YouTube URL"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-300 mb-2 text-sm">Position</label>
                          <select
                            value={editingHeroVideo ? editingHeroVideo.position : newHeroVideo.position}
                            onChange={(e) => {
                              const pos = e.target.value as HeroPosition;
                              editingHeroVideo
                                ? setEditingHeroVideo({ ...editingHeroVideo, position: pos })
                                : setNewHeroVideo({ ...newHeroVideo, position: pos });
                            }}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                          >
                            <option value="top-left">Top Left</option>
                            <option value="top-right">Top Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {editingHeroVideo ? (
                          <>
                            <button
                              onClick={handleUpdateHeroVideo}
                              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Update
                            </button>
                            <button
                              onClick={() => setEditingHeroVideo(null)}
                              className="px-6 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all duration-300"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleAddHeroVideo}
                            disabled={heroVideos.length >= 4}
                            className="px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                            Add Video {heroVideos.length >= 4 ? '(max 4)' : ''}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Hero Videos List */}
                    <div>
                      <h4 className="text-white mb-3">Current Hero Videos ({heroVideos.length}/4)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {heroVideos.map((hv) => {
                          const ytId = hv.videoId.length === 11 ? hv.videoId
                            : (hv.videoId.match(/[?&]v=([a-zA-Z0-9_-]{11})/)?.[1]
                              || hv.videoId.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)?.[1]
                              || hv.videoId);
                          const thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                          return (
                            <div
                              key={hv.id}
                              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex gap-4 hover:border-zinc-600 transition-colors"
                            >
                              <img
                                src={thumb}
                                alt={hv.title}
                                className="w-24 h-16 object-cover rounded-lg"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&q=60'; }}
                              />
                              <div className="flex-1">
                                <h5 className="text-white text-sm font-medium mb-1">{hv.title}</h5>
                                <p className="text-pink-400 text-xs mb-1 capitalize">{hv.position.replace('-', ' ')}</p>
                                <p className="text-zinc-500 text-xs truncate">{hv.videoId}</p>
                              </div>
                              <div className="flex flex-col gap-2 justify-center">
                                <button
                                  onClick={() => setEditingHeroVideo(hv)}
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteHeroVideo(hv.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {heroVideos.length === 0 && (
                          <div className="col-span-2 text-center py-8 text-zinc-400">
                            No hero videos set. Add one above!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}