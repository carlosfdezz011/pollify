import { Song, Playlist } from '../types';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  playlists: Playlist[];
  recentSongs: Song[];
  onPlaySong: (song: Song) => void;
}

export function HomeView({ playlists, recentSongs, onPlaySong }: HomeViewProps) {
  return (
    <div className="p-6 pb-32 max-w-7xl mx-auto space-y-10">
      {/* Hero Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-white">Buenas tardes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSongs.slice(0, 6).map((song, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="group flex items-center bg-white/5 hover:bg-white/10 rounded-md overflow-hidden cursor-pointer transition-colors border border-white/5 hover:border-white/10"
            >
              <img src={song.coverUrl} alt={song.title} className="w-16 h-16 object-cover shadow-md" />
              <div className="flex-1 px-4 font-medium text-white truncate">
                {song.title}
              </div>
              <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
                  <Play size={18} className="fill-current ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Playlists Section */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Hecho para ti</h2>
          <span className="text-sm font-bold text-gray-400 hover:underline cursor-pointer">Mostrar todo</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map((playlist, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={playlist.id}
              className="bg-white/5 hover:bg-white/10 p-4 rounded-xl cursor-pointer transition-all duration-300 group border border-white/5 hover:border-white/10"
            >
              <div className="relative mb-4 aspect-square rounded-md overflow-hidden shadow-lg">
                <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onPlaySong(playlist.songs[0]); }}
                    className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/40 hover:scale-105 hover:bg-blue-400 transition-all"
                  >
                    <Play size={24} className="fill-current ml-1" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-white mb-1 truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Artists / Trending */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Tendencias de Urbano</h2>
        </div>
        <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-6 snap-x hide-scrollbar">
          {recentSongs.slice(4, 10).map((song, i) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={`trend-${song.id}`}
              onClick={() => onPlaySong(song)}
              className="min-w-[160px] snap-start group cursor-pointer"
            >
              <div className="relative aspect-square rounded-full overflow-hidden mb-4 shadow-lg border-4 border-transparent group-hover:border-blue-500/30 transition-colors">
                <img src={song.coverUrl} alt={song.artist} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play size={32} className="text-white fill-current" />
                </div>
              </div>
              <h3 className="font-bold text-white text-center truncate">{song.artist}</h3>
              <p className="text-sm text-gray-400 text-center truncate">Artista</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
