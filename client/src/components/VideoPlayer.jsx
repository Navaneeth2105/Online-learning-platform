import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  ExternalLink,
} from 'lucide-react';

export const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
};

export const getVimeoEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  return match && match[1] ? `https://player.vimeo.com/video/${match[1]}` : null;
};

export const VideoPlayer = ({ videoUrl, title, onEnded, onTimeUpdate }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);
  const vimeoEmbed = getVimeoEmbedUrl(videoUrl);

  const playableVideoUrl = videoUrl?.includes('commondatastorage.googleapis.com')
    ? '/videos/lesson-demo.mp4'
    : videoUrl || '/videos/lesson-demo.mp4';

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideControlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || youtubeEmbed || vimeoEmbed) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onEnded, onTimeUpdate, youtubeEmbed, vimeoEmbed, playableVideoUrl]);

  // If YouTube embed URL
  if (youtubeEmbed) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          background: '#000000',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          aspectRatio: '16/9',
        }}
      >
        <iframe
          src={youtubeEmbed}
          title={title || 'YouTube Video Player'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // If Vimeo embed URL
  if (vimeoEmbed) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          background: '#000000',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          aspectRatio: '16/9',
        }}
      >
        <iframe
          src={vimeoEmbed}
          title={title || 'Vimeo Video Player'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      style={{
        position: 'relative',
        width: '100%',
        background: '#000000',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        aspectRatio: '16/9',
      }}
    >
      <video
        ref={videoRef}
        src={playableVideoUrl}
        onClick={togglePlay}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          cursor: 'pointer',
        }}
        playsInline
      />

      {/* Large Center Play Button when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--gradient-brand)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)',
            transition: 'transform 0.2s',
          }}
          className="center-play-btn"
        >
          <Play size={28} style={{ marginLeft: '4px' }} fill="#fff" />
        </button>
      )}

      {/* Video Controls Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          padding: '1.2rem 1.2rem 0.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          opacity: controlsVisible || !isPlaying ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 10,
        }}
      >
        {/* Progress Scrubber */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            style={{
              width: '100%',
              accentColor: 'var(--brand-primary)',
              cursor: 'pointer',
              height: '4px',
            }}
          />
        </div>

        {/* Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button onClick={togglePlay} style={{ color: '#fff', display: 'flex' }}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} fill="#fff" />}
            </button>

            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button onClick={toggleMute} style={{ color: '#fff', display: 'flex' }}>
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{ width: '60px', accentColor: '#fff', cursor: 'pointer', height: '3px' }}
              />
            </div>

            {/* Time Stamp */}
            <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontFamily: 'monospace' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {/* Speed Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSpeedMenu((p) => !p)}
                style={{
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.15)',
                }}
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-glass)',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    minWidth: '70px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        textAlign: 'left',
                        color: playbackSpeed === s ? 'var(--brand-primary)' : 'var(--text-primary)',
                        fontWeight: playbackSpeed === s ? '700' : '400',
                        borderRadius: '2px',
                      }}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} style={{ color: '#fff', display: 'flex' }}>
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
