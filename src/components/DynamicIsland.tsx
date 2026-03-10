import { motion, AnimatePresence } from 'motion/react';
import { Song } from '../types';
import { AudioLines } from 'lucide-react';

interface DynamicIslandProps {
  currentSong: Song | null;
  isPlaying: boolean;
}

export function DynamicIsland({ currentSong, isPlaying }: DynamicIslandProps) {
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 md:hidden pointer-events-none">
      <AnimatePresence mode="wait">
        {currentSong ? (
          <motion.div
            key="active"
            initial={{ width: 120, height: 32, borderRadius: 16, opacity: 0 }}
            animate={{ width: isPlaying ? 200 : 160, height: 40, borderRadius: 20, opacity: 1 }}
            exit={{ width: 120, height: 32, borderRadius: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-black text-white flex items-center justify-between px-3 shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden border border-white/10"
          >
            <div className="flex items-center gap-2 truncate">
              <img 
                src={currentSong.coverUrl} 
                alt="cover" 
                className="w-6 h-6 rounded-full object-cover animate-[spin_4s_linear_infinite]"
                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
              />
              <div className="flex flex-col truncate">
                <span className="text-[10px] font-medium truncate w-24">{currentSong.title}</span>
              </div>
            </div>
            {isPlaying && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-400 flex-shrink-0"
              >
                <AudioLines size={14} className="animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ width: 160, height: 40, borderRadius: 20 }}
            animate={{ width: 120, height: 32, borderRadius: 16 }}
            className="bg-black border border-white/5"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
