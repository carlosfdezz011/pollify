import { useState } from 'react';
import { Search as SearchIcon, Play, Music } from 'lucide-react';
import { Song } from '../types';
import { motion } from 'motion/react';

interface SearchViewProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
}

const PLATFORMS = [
  { name: 'Spotify', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  { name: 'Apple Music', color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
  { name: 'YouTube', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { name: 'SoundCloud', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' }
];

export function SearchView({ songs, onPlaySong }: SearchViewProps) {
  const [query, setQuery] = useState('');
  
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(query.toLowerCase()) || 
    song.artist.toLowerCase().includes(query.toLowerCase()) ||
    song.album.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 pb-32 max-w-7xl mx-auto space-y-8">
      {/* Liquid Glass Search Bar */}
      <div className="sticky top-0 z-20 pt-4 pb-6 bg-black/40 backdrop-blur-xl -mx-6 px-6">
        <div className="relative group max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
          <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:bg-white/15">
            <SearchIcon className="text-white/70 mr-4" size={24} />
            <input
              type="text"
              placeholder="Buscar canciones, artistas, géneros..."
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/50 text-lg font-medium"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Music className="text-blue-400" /> 
          {query ? 'Resultados de búsqueda' : 'Explorar todo'}
        </h2>
        
        {filteredSongs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No se encontraron resultados para "{query}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSongs.map((song, i) => {
              const platform = PLATFORMS[i % PLATFORMS.length];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  key={song.id}
                  onClick={() => onPlaySong(song)}
                  className="group flex items-center bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/5 hover:border-white/20 backdrop-blur-sm shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={24} className="text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 px-4 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">{song.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    <div className="mt-1.5">
                      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${platform.bg} ${platform.color} ${platform.border}`}>
                        {platform.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
