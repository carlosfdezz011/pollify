import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Radio, Headphones, Repeat, Power, Share2, ListMusic, Activity, Disc3, Zap, Sliders } from 'lucide-react';
import { Song } from '../types';

interface ManualMixProps {
  songs: Song[];
  onTakeover: () => void;
}

const MOCK_FRIENDS = [
  { id: 1, name: 'Carlos', avatar: 'https://picsum.photos/seed/carlos/100/100' },
  { id: 2, name: 'Lucía', avatar: 'https://picsum.photos/seed/lucia/100/100' },
  { id: 3, name: 'Miguel', avatar: 'https://picsum.photos/seed/miguel/100/100' },
];

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function ManualMix({ songs, onTakeover }: ManualMixProps) {
  const [deckA, setDeckA] = useState<Song | null>(songs[0] || null);
  const [deckB, setDeckB] = useState<Song | null>(songs[1] || null);
  
  // Global State
  const [crossfader, setCrossfader] = useState(50);
  const [isLive, setIsLive] = useState(false);
  
  // Deck A State
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [timeA, setTimeA] = useState(0);
  const [tempoA, setTempoA] = useState(0);
  const [volA, setVolA] = useState(80);
  const durationA = deckA ? deckA.durationMs / 1000 : 0;

  // Deck B State
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [timeB, setTimeB] = useState(0);
  const [tempoB, setTempoB] = useState(0);
  const [volB, setVolB] = useState(80);
  const durationB = deckB ? deckB.durationMs / 1000 : 0;

  const handleGoLive = () => {
    setIsLive(!isLive);
    if (!isLive) onTakeover();
  };

  const handlePlayA = () => {
    if (!isPlayingA) onTakeover();
    setIsPlayingA(!isPlayingA);
  };

  const handlePlayB = () => {
    if (!isPlayingB) onTakeover();
    setIsPlayingB(!isPlayingB);
  };

  // Virtual Timers for full playback
  useEffect(() => {
    let intA: any;
    if (isPlayingA && durationA > 0) {
      intA = setInterval(() => {
        setTimeA(prev => {
          if (prev >= durationA) { setIsPlayingA(false); return durationA; }
          return prev + (1 * (1 + tempoA / 100));
        });
      }, 1000);
    }
    return () => clearInterval(intA);
  }, [isPlayingA, durationA, tempoA]);

  useEffect(() => {
    let intB: any;
    if (isPlayingB && durationB > 0) {
      intB = setInterval(() => {
        setTimeB(prev => {
          if (prev >= durationB) { setIsPlayingB(false); return durationB; }
          return prev + (1 * (1 + tempoB / 100));
        });
      }, 1000);
    }
    return () => clearInterval(intB);
  }, [isPlayingB, durationB, tempoB]);

  // Reset on song change
  useEffect(() => { setTimeA(0); setIsPlayingA(false); }, [deckA]);
  useEffect(() => { setTimeB(0); setIsPlayingB(false); }, [deckB]);

  return (
    <div className="h-full w-full flex flex-col bg-[#050505] text-white overflow-hidden relative font-sans selection:bg-blue-500/30 p-2 md:p-4 gap-2 md:gap-4">
      
      {/* Stratospheric NASA Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-[100%] h-[100%] bg-white/5 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" />
      </div>

      {/* 1. TOP BAR: Social & Status (Shrink 0) */}
      <div className="relative z-10 flex justify-between items-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 md:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleGoLive} className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest transition-all ${isLive ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30'}`}>
            <Radio size={14} className={isLive ? 'animate-pulse' : ''} />
            {isLive ? 'ON AIR' : 'GO LIVE'}
          </button>
          
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {MOCK_FRIENDS.map(f => (
                  <img key={f.id} src={f.avatar} className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-black shadow-md" alt={f.name} />
                ))}
              </div>
              <span className="hidden sm:inline text-[9px] text-green-400 font-mono animate-pulse border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full">SYNCED</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 md:px-4 md:py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-[10px] md:text-xs font-bold flex items-center gap-1.5">
            <Share2 size={14} /> <span className="hidden md:inline">Invite</span>
          </button>
          <button onClick={() => setIsLive(false)} className="p-1.5 md:px-4 md:py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-[10px] md:text-xs font-bold flex items-center gap-1.5 border border-white/10">
            <Power size={14} /> <span className="hidden md:inline">Switch Playback</span>
          </button>
        </div>
      </div>

      {/* 2. STACKED WAVEFORMS (Shrink 0) */}
      <div className="relative z-10 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 md:p-3 shadow-inner flex flex-col gap-1 shrink-0">
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-red-500/30 z-0" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-red-500 z-20 shadow-[0_0_15px_rgba(239,68,68,1)]" />
        
        <WaveformRow song={deckA} time={timeA} duration={durationA} isPlaying={isPlayingA} color="blue" setTime={setTimeA} />
        <WaveformRow song={deckB} time={timeB} duration={durationB} isPlaying={isPlayingB} color="purple" setTime={setTimeB} />
      </div>

      {/* 3. MAIN CONSOLE: Decks & Mixer (Flex 1, Min H 0 to prevent clipping) */}
      <div className="relative z-10 flex-1 min-h-0 grid grid-cols-2 lg:grid-cols-3 grid-rows-[1fr_1.2fr] lg:grid-rows-1 gap-2 md:gap-4">
        
        {/* DECK A */}
        <Deck 
          title="A" song={deckA} color="blue" isPlaying={isPlayingA} time={timeA} duration={durationA} tempo={tempoA}
          onPlay={handlePlayA} onTempo={setTempoA} onSelect={() => setDeckA(songs[Math.floor(Math.random() * songs.length)])}
          className="col-span-1 row-span-1 lg:col-span-1"
        />

        {/* DECK B */}
        <Deck 
          title="B" song={deckB} color="purple" isPlaying={isPlayingB} time={timeB} duration={durationB} tempo={tempoB}
          onPlay={handlePlayB} onTempo={setTempoB} onSelect={() => setDeckB(songs[Math.floor(Math.random() * songs.length)])}
          className="col-span-1 row-span-1 lg:col-span-1 lg:order-3"
        />

        {/* CENTRAL MIXER */}
        <div className="col-span-2 row-span-1 lg:col-span-1 lg:order-2 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-2 md:p-4 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-row lg:flex-col gap-2 md:gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
          
          {/* EQ Section (Left on Mobile, Top on Desktop) */}
          <div className="flex-1 flex flex-row justify-around items-center bg-white/5 rounded-2xl p-2 border border-white/5 shadow-inner">
            <EQColumn color="blue" />
            <VUMeters levelA={isPlayingA ? volA : 0} levelB={isPlayingB ? volB : 0} />
            <EQColumn color="purple" />
          </div>

          {/* Fader Section (Right on Mobile, Bottom on Desktop) */}
          <div className="flex-[1.2] flex flex-col justify-between bg-white/5 rounded-2xl p-2 md:p-4 border border-white/5 shadow-inner gap-2">
            <div className="flex-1 flex justify-around items-end px-2 md:px-6">
              <VerticalFader value={volA} onChange={setVolA} color="blue" />
              <VerticalFader value={volB} onChange={setVolB} color="purple" />
            </div>
            
            {/* Crossfader */}
            <div className="w-full bg-black/50 rounded-xl p-2 md:p-3 border border-white/5 shadow-inner mt-2">
              <div className="flex justify-between text-[8px] md:text-[9px] font-black text-gray-500 mb-1 tracking-widest">
                <span>DECK A</span><span className="text-gray-600">CROSSFADER</span><span>DECK B</span>
              </div>
              <div className="relative h-8 md:h-10 flex items-center">
                <div className="absolute inset-x-2 h-1.5 bg-black rounded-full border border-white/10 shadow-inner" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/20" />
                <input 
                  type="range" min="0" max="100" value={crossfader} onChange={(e) => setCrossfader(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="absolute w-10 h-8 md:w-12 md:h-10 bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-black rounded shadow-[0_5px_15px_rgba(0,0,0,0.8)] pointer-events-none transition-all flex items-center justify-center"
                  style={{ left: `calc(${crossfader}% - 20px)` }}
                >
                  <div className="w-1 h-5 bg-white/30 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. STATUS BAR (Shrink 0) */}
      <div className="relative z-10 flex justify-between items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-2 md:p-3 shrink-0 text-[9px] md:text-[10px] font-mono font-bold text-gray-400">
        <div className="flex items-center gap-3 md:gap-6">
          <span className="flex items-center gap-1.5 text-white"><Activity size={12} className="text-blue-400"/> MASTER BPM: 124.0</span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5"><Sliders size={12} className="text-purple-400"/> FX: REVERB (A), DELAY (B)</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <span className="truncate max-w-[100px] md:max-w-none text-white">ACTIVE: {deckA?.title || 'NONE'} / {deckB?.title || 'NONE'}</span>
          <span className="hidden sm:flex items-center gap-1.5"><Zap size={12} className="text-yellow-400"/> LATENCY: 4ms</span>
        </div>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function WaveformRow({ song, time, duration, isPlaying, color, setTime }: any) {
  const progress = duration > 0 ? (time / duration) * 100 : 0;
  const colorClass = color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]';
  
  // Generate a static waveform pattern so it looks like a real song
  const waveData = useMemo(() => Array.from({ length: 120 }, () => Math.random() * 70 + 30), []);

  return (
    <div className="relative h-8 md:h-12 w-full flex items-center cursor-pointer group"
         onClick={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           setTime(((e.clientX - rect.left) / rect.width) * duration);
         }}>
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/5 rounded-lg overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 ${colorClass} opacity-20 transition-all duration-300`} style={{ width: `${progress}%` }} />
      </div>
      
      {/* Simulated Waveform Bars */}
      <div className="absolute inset-0 flex items-center justify-between px-1 gap-[1px] opacity-70 group-hover:opacity-100 transition-opacity">
        {waveData.map((height, i) => {
          const isActive = (i / 120) * 100 <= progress;
          return (
            <motion.div 
              key={i}
              className={`flex-1 rounded-full ${isActive ? colorClass.split(' ')[0] : 'bg-white/20'}`}
              initial={{ height: `${height}%` }}
              animate={{ height: isPlaying && Math.abs((i/120)*100 - progress) < 2 ? `${Math.random() * 80 + 20}%` : `${height}%` }}
              transition={{ duration: 0.1 }}
            />
          );
        })}
      </div>
      
      {/* Info Overlay */}
      <div className="absolute inset-x-2 bottom-0.5 flex justify-between text-[7px] md:text-[9px] font-mono font-bold text-white/90 pointer-events-none drop-shadow-md">
        <span className="truncate max-w-[70%]">{song?.title || 'NO TRACK LOADED'}</span>
        <span>{formatTime(time)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
}

function Deck({ title, song, color, isPlaying, time, duration, tempo, onPlay, onTempo, onSelect, className }: any) {
  const isBlue = color === 'blue';
  const glow = isBlue ? 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'shadow-[0_0_30px_rgba(168,85,247,0.3)]';
  const text = isBlue ? 'text-blue-400' : 'text-purple-400';
  const border = isBlue ? 'border-blue-500/30' : 'border-purple-500/30';
  const bg = isBlue ? 'bg-blue-500' : 'bg-purple-500';

  return (
    <div className={`bg-black/40 backdrop-blur-xl rounded-3xl border ${border} p-2 md:p-4 flex flex-col relative overflow-hidden shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-2 md:mb-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 border ${border} flex items-center justify-center font-black text-sm md:text-lg ${text} shrink-0`}>
            {title}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] md:text-xs font-bold text-white truncate">{song?.title || 'Empty Deck'}</span>
            <span className="text-[8px] md:text-[10px] text-gray-400 truncate">{song?.artist || 'Select a track'}</span>
          </div>
        </div>
        <button onClick={onSelect} className="p-1.5 md:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0">
          <ListMusic size={14} className="text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2 md:gap-4 min-h-0 relative">
        
        {/* Jog Wheel (Scales to fit) */}
        <div className={`relative aspect-square w-full max-w-[120px] md:max-w-[200px] rounded-full border-[4px] md:border-[8px] border-black ${glow} flex items-center justify-center shrink-0`}>
          {song ? (
            <motion.img 
              src={song.coverUrl} alt="Cover" 
              className="w-full h-full rounded-full object-cover opacity-80"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3 * (1 - tempo/100), repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <Disc3 size={24} className="text-gray-700" />
            </div>
          )}
          {/* Vinyl Grooves Overlay */}
          <div className="absolute inset-0 rounded-full border-[10px] md:border-[20px] border-black/50 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]" />
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
          {/* Center Spindle */}
          <div className="absolute w-8 h-8 md:w-12 md:h-12 bg-black rounded-full border-2 border-white/10 flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/50 rounded-full" />
          </div>
          {/* Active Ring */}
          <svg className="absolute inset-[-6px] md:inset-[-10px] w-[calc(100%+12px)] md:w-[calc(100%+20px)] h-[calc(100%+12px)] md:h-[calc(100%+20px)] pointer-events-none -rotate-90">
            <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
            <circle cx="50%" cy="50%" r="48%" fill="none" stroke={isBlue ? '#3b82f6' : '#a855f7'} strokeWidth="3" 
                    strokeDasharray="300" strokeDashoffset={300 - (300 * (time / (duration || 1)))} 
                    className="transition-all duration-300" />
          </svg>
        </div>

        {/* Transport & Pitch */}
        <div className="w-full flex flex-col gap-2 shrink-0">
          <div className="flex justify-between items-center px-2">
            <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white shadow-lg">
              <Headphones size={14} />
            </button>
            <button onClick={onPlay} className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isPlaying ? `${bg} text-white scale-105` : 'bg-white text-black hover:scale-105'}`}>
              {isPlaying ? <Pause size={18} className="fill-current md:w-6 md:h-6" /> : <Play size={18} className="fill-current ml-1 md:w-6 md:h-6" />}
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white shadow-lg">
              <Repeat size={14} />
            </button>
          </div>
          
          {/* Pitch Slider */}
          <div className="bg-black/40 rounded-lg p-1.5 md:p-2 border border-white/5 flex items-center gap-2 shadow-inner">
            <span className="text-[8px] md:text-[9px] font-bold text-gray-500">PITCH</span>
            <input 
              type="range" min="-10" max="10" step="0.1" value={tempo} onChange={(e) => onTempo(Number(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[8px] md:text-[9px] font-mono text-white w-8 md:w-10 text-right">{tempo > 0 ? '+' : ''}{tempo.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EQColumn({ color }: { color: 'blue' | 'purple' }) {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-3">
      <Knob label="HI" color={color} size="sm" />
      <Knob label="MID" color={color} size="sm" />
      <Knob label="LOW" color={color} size="sm" />
      <div className="w-full h-[1px] bg-white/10 my-0.5" />
      <Knob label="FLTR" color={color} size="md" />
    </div>
  );
}

function Knob({ label, color, size = 'sm', value = 50 }: any) {
  const isBlue = color === 'blue';
  const activeColor = isBlue ? 'bg-blue-400 shadow-[0_0_8px_#3b82f6]' : 'bg-purple-400 shadow-[0_0_8px_#a855f7]';
  const dim = size === 'sm' ? 'w-7 h-7 md:w-9 md:h-9' : 'w-9 h-9 md:w-12 md:h-12';
  const rotation = -135 + (value / 100) * 270;

  return (
    <div className="flex flex-col items-center gap-0.5 md:gap-1">
      <div className={`${dim} rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-black shadow-[0_3px_6px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] relative cursor-pointer group`}>
        <div className="absolute inset-0 rounded-full border border-white/5" />
        <motion.div className="absolute inset-0" animate={{ rotate: rotation }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <div className={`absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 md:w-1 ${size === 'sm' ? 'h-1.5 md:h-2' : 'h-2 md:h-3'} ${value !== 50 ? activeColor : 'bg-white/80'} rounded-full`} />
        </motion.div>
      </div>
      <span className="text-[7px] md:text-[8px] font-bold text-gray-400 tracking-wider">{label}</span>
    </div>
  );
}

function VerticalFader({ value, onChange, color }: any) {
  const isBlue = color === 'blue';
  const glow = isBlue ? 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'shadow-[0_0_10px_rgba(168,85,247,0.5)]';

  return (
    <div className="relative w-8 md:w-10 h-full flex justify-center group py-2">
      <div className="w-1.5 md:w-2 h-full bg-black rounded-full border border-white/10 shadow-inner relative overflow-hidden">
        <div className="absolute bottom-0 w-full bg-white/20" style={{ height: `${value}%` }} />
      </div>
      <input 
        type="range" min="0" max="100" value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any}
      />
      <div 
        className={`absolute w-8 h-6 md:w-10 md:h-8 bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-black rounded shadow-[0_3px_8px_rgba(0,0,0,0.8)] pointer-events-none transition-all flex items-center justify-center ${glow}`}
        style={{ bottom: `calc(${value}% - 12px)` }}
      >
        <div className="w-4 md:w-6 h-0.5 md:h-1 bg-white/40 rounded-full shadow-[0_0_3px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  );
}

function VUMeters({ levelA, levelB }: { levelA: number, levelB: number }) {
  return (
    <div className="flex gap-1 md:gap-2 h-full py-2">
      <VUMeter level={levelA} />
      <VUMeter level={levelB} />
    </div>
  );
}

function VUMeter({ level }: { level: number }) {
  const [displayLevel, setDisplayLevel] = useState(0);
  
  useEffect(() => {
    if (level === 0) { setDisplayLevel(0); return; }
    const int = setInterval(() => {
      setDisplayLevel(level * 0.7 + (Math.random() * level * 0.3));
    }, 100);
    return () => clearInterval(int);
  }, [level]);

  return (
    <div className="w-1.5 md:w-2 h-full bg-black rounded-full border border-white/10 shadow-inner overflow-hidden flex flex-col-reverse gap-[1px] p-[1px]">
      {[...Array(15)].map((_, i) => {
        const threshold = (i / 15) * 100;
        const isActive = displayLevel > threshold;
        let color = 'bg-green-500';
        if (i > 10) color = 'bg-yellow-500';
        if (i > 13) color = 'bg-red-500';
        
        return (
          <div key={i} className={`w-full flex-1 rounded-sm transition-all duration-75 ${isActive ? `${color} shadow-[0_0_4px_currentColor]` : 'bg-white/5'}`} />
        );
      })}
    </div>
  );
}
