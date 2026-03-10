import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, ListMusic, Maximize2 } from 'lucide-react';
import { Song } from '../types';
import { useState, useEffect } from 'react';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setIsPlaying: (playing: boolean) => void;
  onExpand: () => void;
  currentTime: number;
  duration: number;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  onSeek: (pos: number) => void;
}

export function Player({ 
  currentSong, isPlaying, togglePlay, nextSong, prevSong, setIsPlaying, onExpand,
  currentTime, duration, setCurrentTime, setDuration, audioRef, onSeek
}: PlayerProps) {
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, setIsPlaying, audioRef]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      onSeek(pos);
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newVolume = Math.max(0, Math.min(1, pos));
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-4 md:px-6 z-40">
      <audio 
        ref={audioRef} 
        src={currentSong.audioUrl} 
        loop={true} // Loop the preview to simulate full song playback
      />
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />

      {/* Song Info */}
      <div className="flex items-center gap-3 md:gap-4 w-1/3 min-w-[120px]">
        <div className="relative group overflow-hidden rounded-md cursor-pointer" onClick={onExpand}>
          <img 
            src={currentSong.coverUrl} 
            alt={currentSong.title} 
            className="w-12 h-12 md:w-14 md:h-14 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 size={16} className="text-white" />
          </div>
        </div>
        <div className="flex flex-col truncate cursor-pointer" onClick={onExpand}>
          <span className="text-white font-medium text-sm md:text-base truncate hover:underline">
            {currentSong.title}
          </span>
          <span className="text-gray-400 text-xs md:text-sm truncate hover:underline">
            {currentSong.artist}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center max-w-[40%] w-full">
        <div className="flex items-center gap-4 md:gap-6 mb-1 md:mb-2">
          <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
            <Shuffle size={18} />
          </button>
          <button onClick={prevSong} className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={20} className="fill-current" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
          </button>
          <button onClick={nextSong} className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} className="fill-current" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
            <Repeat size={18} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 hidden md:flex">
          <span className="text-xs text-gray-400 w-8 text-right">{formatTime(currentTime)}</span>
          <div 
            className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white group-hover:bg-blue-500 relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md" />
            </div>
          </div>
          <span className="text-xs text-gray-400 w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center justify-end gap-4 w-1/3 hidden md:flex">
        <button onClick={onExpand} className="text-gray-400 hover:text-white transition-colors">
          <Maximize2 size={18} />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <ListMusic size={18} />
        </button>
        <div className="flex items-center gap-2 w-24 group">
          <Volume2 size={18} className="text-gray-400 group-hover:text-white transition-colors" />
          <div 
            className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
            onClick={handleVolumeClick}
          >
            <div className="h-full bg-white group-hover:bg-blue-500" style={{ width: `${volume * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
