import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Disc3, Play, Activity } from 'lucide-react';
import { Song } from '../types';

interface AIDJProps {
  onPlaySong: (song: Song) => void;
  mockSongs: Song[];
}

export function AIDJ({ onPlaySong, mockSongs }: AIDJProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMix, setGeneratedMix] = useState<Song[] | null>(null);
  const [isPlayingMix, setIsPlayingMix] = useState(false);

  const generateMix = () => {
    setIsGenerating(true);
    setGeneratedMix(null);
    setIsPlayingMix(false);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const shuffled = [...mockSongs].sort(() => 0.5 - Math.random());
      setGeneratedMix(shuffled.slice(0, 5));
      setIsGenerating(false);
    }, 2500);
  };

  const handlePlayMix = () => {
    if (generatedMix && generatedMix.length > 0) {
      onPlaySong(generatedMix[0]);
      setIsPlayingMix(true);
    }
  };

  return (
    <div className="p-6 pb-32 max-w-5xl mx-auto">
      <div className="text-center mb-12 mt-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-6 shadow-[0_0_40px_rgba(37,99,235,0.5)]"
        >
          <Sparkles size={40} className="text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Pollifay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI DJ</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Tu DJ personal impulsado por inteligencia artificial. Analizamos tu historial para crear mezclas dinámicas con transiciones perfectas.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={generateMix}
          disabled={isGenerating}
          className="relative group overflow-hidden rounded-full p-[2px]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full opacity-70 group-hover:opacity-100 animate-[spin_3s_linear_infinite]" />
          <div className="relative bg-black px-8 py-4 rounded-full flex items-center gap-3 transition-all group-hover:bg-black/80">
            {isGenerating ? (
              <>
                <Disc3 className="animate-spin text-blue-400" size={24} />
                <span className="text-white font-medium text-lg">Analizando BPM y tonalidades...</span>
              </>
            ) : (
              <>
                <Sparkles className="text-blue-400" size={24} />
                <span className="text-white font-medium text-lg">Generar Mix Automático</span>
              </>
            )}
          </div>
        </button>
      </div>

      {generatedMix && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.3)]"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Activity className="text-purple-400" /> Mix: Flow Urbano Dinámico
              </h2>
              <p className="text-gray-400 mt-1">Transiciones suaves • BPM Sincronizado</p>
            </div>
            <button 
              onClick={handlePlayMix}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105"
            >
              <Play size={20} className="fill-current" /> Iniciar Sesión DJ
            </button>
          </div>

          {/* Professional DJ Visualizer */}
          <div className="bg-black/50 rounded-2xl p-6 border border-white/5 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] animate-[pulse_4s_ease-in-out_infinite]" />
            <div className="flex flex-col gap-4 relative z-10">
              {generatedMix.slice(0, 3).map((song, i) => (
                <div key={song.id} className="flex items-center gap-4">
                  <div className="w-24 text-xs font-mono text-gray-500 text-right">CH {i + 1}</div>
                  <div className="flex-1 h-8 bg-white/5 rounded flex items-center px-1 gap-1 overflow-hidden">
                    {/* Simulated Waveform */}
                    {Array.from({ length: 40 }).map((_, j) => (
                      <motion.div 
                        key={j}
                        className={`w-full rounded-full ${isPlayingMix && i === 0 ? 'bg-blue-400' : 'bg-white/20'}`}
                        initial={{ height: '20%' }}
                        animate={{ height: isPlayingMix && i === 0 ? `${Math.random() * 80 + 20}%` : `${Math.random() * 40 + 10}%` }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                      />
                    ))}
                  </div>
                  <div className="w-32 truncate text-xs font-bold text-white/80">{song.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-500 tracking-widest mb-4 uppercase">Pistas en la mezcla</h3>
            {generatedMix.map((song, index) => (
              <div 
                key={song.id}
                onClick={() => onPlaySong(song)}
                className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-colors group border border-transparent hover:border-white/10"
              >
                <div className="w-8 text-center text-gray-500 font-mono">{String(index + 1).padStart(2, '0')}</div>
                <div className="w-8 flex justify-center hidden group-hover:flex">
                  <Play size={16} className="text-blue-400 fill-current" />
                </div>
                <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-md object-cover shadow-md" />
                <div className="flex-1">
                  <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{song.title}</h4>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
                <div className="text-gray-400 text-sm hidden sm:block">
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">BPM {Math.floor(Math.random() * 40 + 90)}</span>
                </div>
                <div className="text-gray-400 text-sm w-12 text-right font-mono">{song.duration}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
