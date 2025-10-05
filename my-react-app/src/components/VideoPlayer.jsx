import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, ExternalLink, Maximize } from 'lucide-react';
import { Button } from './ui/button';

export function VideoPlayer({ video, onDownload, onOpenOriginal }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0B3D91] rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0B3D91]">{video.title}</h3>
              <p className="text-sm text-gray-600">Video summary</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload && onDownload(video.link)}
              className="text-[#FC3D21] border-[#FC3D21] hover:bg-[#FC3D21]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenOriginal && onOpenOriginal(video.link)}
              className="text-[#0B3D91] border-[#0B3D91] hover:bg-[#0B3D91]/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Original
            </Button>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div 
        className="relative bg-black"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
          poster={video.poster}
        />

        {/* Overlay de controles */}
        {showControls && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Button
              onClick={togglePlayPause}
              className="w-16 h-16 rounded-full bg-[#0B3D91] hover:bg-[#0B3D91]/90 text-white"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>
          </div>
        )}

        {/* Controles inferiores */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-[#0B3D91] hover:bg-[#0B3D91]/90 text-white"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </Button>
            
            <Button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            
            <div className="flex-1">
              <div className="flex justify-between text-sm text-white mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              {/* Barra de progreso */}
              <div 
                className="w-full h-2 bg-white/30 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-[#0B3D91] rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
