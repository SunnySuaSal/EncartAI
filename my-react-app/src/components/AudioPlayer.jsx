import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Download, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

export function AudioPlayer({ audio, onDownload, onOpenOriginal }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0B3D91] rounded-full flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#0B3D91]">{audio.title}</h3>
            <p className="text-sm text-gray-600">Audio summary</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload && onDownload(audio.link)}
            className="text-[#FC3D21] border-[#FC3D21] hover:bg-[#FC3D21]/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenOriginal && onOpenOriginal(audio.link)}
            className="text-[#0B3D91] border-[#0B3D91] hover:bg-[#0B3D91]/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Original
          </Button>
        </div>
      </div>

      {/* Audio Player */}
      <div className="space-y-3">
        {/* Controles */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-[#0B3D91] hover:bg-[#0B3D91]/90 text-white"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </Button>
          
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            {/* Barra de progreso */}
            <div 
              className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-[#0B3D91] rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Audio element */}
        <audio
          ref={audioRef}
          src={audio.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />
      </div>
    </div>
  );
}
