import { motion } from 'motion/react';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Share2, Heart } from 'lucide-react';
import { Song } from '../types';

interface NowPlayingProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onClose: () => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  currentTime: number;
  duration: number;
  onSeek: (pos: number) => void;
}

export function NowPlaying({ 
  currentSong, isPlaying, onClose, togglePlay, nextSong, prevSong, currentTime, duration, onSeek 
}: NowPlayingProps) {
  if (!currentSong) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    onSeek(pos);
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-[80px] scale-110"
        style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
          <ChevronDown size={32} />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold tracking-widest text-white/50 uppercase">Reproduciendo desde</p>
          <p className="text-sm font-medium text-white">{currentSong.album}</p>
        </div>
        <button className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
          <Share2 size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 md:px-20 max-w-3xl mx-auto w-full">
        {/* Artwork */}
        <motion.div 
          className="w-full aspect-square max-w-[400px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Song Info */}
        <div className="w-full flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentSong.title}</h1>
            <p className="text-xl text-white/70">{currentSong.artist}</p>
          </div>
          <button className="text-white/70 hover:text-blue-400 transition-colors">
            <Heart size={32} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div 
            className="h-2 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white group-hover:bg-blue-400 transition-colors relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-white/50 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full flex items-center justify-between max-w-[300px]">
          <button className="text-white/50 hover:text-white transition-colors">
            <Shuffle size={24} />
          </button>
          <button onClick={prevSong} className="text-white hover:text-blue-400 transition-colors">
            <SkipBack size={40} className="fill-current" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-2" />}
          </button>
          <button onClick={nextSong} className="text-white hover:text-blue-400 transition-colors">
            <SkipForward size={40} className="fill-current" />
          </button>
          <button className="text-white/50 hover:text-white transition-colors">
            <Repeat size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
