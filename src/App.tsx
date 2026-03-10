import { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { DynamicIsland } from './components/DynamicIsland';
import { HomeView } from './components/Home';
import { AIDJ } from './components/AIDJ';
import { SearchView } from './components/Search';
import { ManualMix } from './components/ManualMix';
import { NowPlaying } from './components/NowPlaying';
import { LibraryView } from './components/Library';
import { fetchSongs } from './services/itunes';
import { Song, Playlist } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Player state (Virtual Timer for Full Song Simulation)
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    fetchSongs().then(data => {
      setSongs(data);
      if (data.length > 0) {
        setPlaylists([
          {
            id: 'p1',
            name: 'Éxitos Urbanos',
            description: 'Lo más pegado del momento.',
            coverUrl: data[0]?.coverUrl || 'https://picsum.photos/seed/p1/300/300',
            songs: data.slice(0, 10),
          },
          {
            id: 'p2',
            name: 'Trap Latino',
            description: 'Los mejores temas de trap.',
            coverUrl: data[10]?.coverUrl || 'https://picsum.photos/seed/p2/300/300',
            songs: data.slice(10, 20),
          },
          {
            id: 'p3',
            name: 'Descubrimiento Semanal',
            description: 'Nuevos sonidos para ti.',
            coverUrl: data[20]?.coverUrl || 'https://picsum.photos/seed/p3/300/300',
            songs: data.slice(20, 30),
          }
        ]);
      }
      setIsLoading(false);
    });
  }, []);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  }, [currentSong, songs]);

  const prevSong = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  // Virtual Timer Logic for Full Song Simulation
  useEffect(() => {
    if (currentSong) {
      setDuration(currentSong.durationMs / 1000);
      setCurrentTime(0);
    }
  }, [currentSong]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration && duration > 0) {
            return prev; // Stop incrementing, let the next effect handle song change
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    if (currentTime >= duration && duration > 0 && isPlaying) {
      nextSong();
    }
  }, [currentTime, duration, isPlaying, nextSong]);

  const handleSeek = (pos: number) => {
    if (duration) {
      const newTime = pos * duration;
      setCurrentTime(newTime);
      if (audioRef.current) {
        // Seek the actual audio element (modulo 30s since it's a preview)
        audioRef.current.currentTime = newTime % (audioRef.current.duration || 30);
      }
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden flex font-sans selection:bg-blue-500/30">
      {/* Background Gradients - Deep Black, Blue & White Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[150px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-800/20 rounded-full blur-[180px] translate-x-1/3 translate-y-1/3" />
        {/* White glow accent */}
        <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-white/5 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <DynamicIsland currentSong={currentSong} isPlaying={isPlaying} />

      <div className="flex w-full h-full z-10 relative">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          {/* Mobile Header */}
          <div className="md:hidden p-4 sticky top-0 z-30 bg-black/60 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
              Pollifay
            </h1>
            <div className="flex gap-4">
              <button onClick={() => setCurrentView('search')} className="text-gray-400 hover:text-white">
                Buscar
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-blue-400">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p className="text-white font-medium">Cargando biblioteca musical...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {currentView === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <HomeView 
                    playlists={playlists} 
                    recentSongs={songs} 
                    onPlaySong={handlePlaySong} 
                  />
                </motion.div>
              )}
              {currentView === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <SearchView 
                    songs={songs} 
                    onPlaySong={handlePlaySong} 
                  />
                </motion.div>
              )}
              {currentView === 'library' && (
                <motion.div
                  key="library"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <LibraryView 
                    playlists={playlists}
                    songs={songs}
                    onPlaySong={handlePlaySong}
                  />
                </motion.div>
              )}
              {currentView === 'ai-dj' && (
                <motion.div
                  key="ai-dj"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <AIDJ 
                    onPlaySong={handlePlaySong}
                    mockSongs={songs}
                  />
                </motion.div>
              )}
              {currentView === 'manual-mix' && (
                <motion.div
                  key="manual-mix"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <ManualMix 
                    songs={songs} 
                    onTakeover={() => setIsPlaying(false)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      <Player 
        currentSong={currentSong} 
        isPlaying={isPlaying} 
        togglePlay={togglePlay}
        nextSong={nextSong}
        prevSong={prevSong}
        setIsPlaying={setIsPlaying}
        onExpand={() => setIsNowPlayingOpen(true)}
        currentTime={currentTime}
        duration={duration}
        setCurrentTime={setCurrentTime}
        setDuration={setDuration}
        audioRef={audioRef}
        onSeek={handleSeek}
      />

      <AnimatePresence>
        {isNowPlayingOpen && (
          <NowPlaying
            currentSong={currentSong}
            isPlaying={isPlaying}
            onClose={() => setIsNowPlayingOpen(false)}
            togglePlay={togglePlay}
            nextSong={nextSong}
            prevSong={prevSong}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
