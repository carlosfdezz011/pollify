import { motion } from 'motion/react';
import { Heart, Users, Sparkles, Plus, Play, Radio, ListMusic, Clock } from 'lucide-react';
import { Song, Playlist } from '../types';

interface LibraryProps {
  playlists: Playlist[];
  songs: Song[];
  onPlaySong: (song: Song) => void;
}

const MOCK_FRIENDS = [
  'https://picsum.photos/seed/carlos/100/100',
  'https://picsum.photos/seed/lucia/100/100',
  'https://picsum.photos/seed/miguel/100/100',
  'https://picsum.photos/seed/ana/100/100',
];

export function LibraryView({ playlists, songs, onPlaySong }: LibraryProps) {
  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Tu Biblioteca</h1>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white backdrop-blur-md">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Party Mode Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden group cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <Radio size={12} /> EN VIVO
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Users className="text-blue-400" /> Modo Fiesta
              </h2>
            </div>
            <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
              Mezcla tus canciones con las de tus amigos en tiempo real. Crea playlists colaborativas automáticamente y escuchen juntos sin importar dónde estén. Sincronización perfecta.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            <div className="flex -space-x-4">
              {MOCK_FRIENDS.map((avatar, i) => (
                <img key={i} src={avatar} alt="Friend" className="w-12 h-12 rounded-full border-2 border-black object-cover shadow-lg" />
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-black bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white">
                +8
              </div>
            </div>
            <button className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Unirse a la Fiesta
            </button>
          </div>
        </div>
      </motion.div>

      {/* Smart Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <CategoryCard icon={Heart} title="Tus Me Gusta" subtitle="1,284 canciones" color="from-pink-500 to-rose-500" />
        <CategoryCard icon={Sparkles} title="Mix Inteligente" subtitle="Basado en ti" color="from-blue-500 to-cyan-500" />
        <CategoryCard icon={Clock} title="Escuchado Reciente" subtitle="Últimos 7 días" color="from-purple-500 to-indigo-500" />
        <CategoryCard icon={ListMusic} title="Playlists Locales" subtitle="Descargadas" color="from-emerald-500 to-teal-500" />
      </div>

      {/* Universal Playlists Grid */}
      <h2 className="text-2xl font-bold text-white mb-6">Tus Playlists</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {playlists.map((playlist, i) => (
          <motion.div 
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group cursor-pointer backdrop-blur-xl"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-lg">
              <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (playlist.songs.length > 0) onPlaySong(playlist.songs[0]);
                  }}
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-110 transition-transform"
                >
                  <Play size={24} className="fill-current ml-1" />
                </button>
              </div>
            </div>
            <h3 className="text-white font-bold truncate">{playlist.name}</h3>
            <p className="text-gray-400 text-sm truncate mt-1">{playlist.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ icon: Icon, title, subtitle, color }: { icon: any, title: string, subtitle: string, color: string }) {
  return (
    <div className={`bg-gradient-to-br ${color} p-[1px] rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform shadow-lg`}>
      <div className="bg-black/60 backdrop-blur-xl h-full rounded-[15px] p-4 md:p-6 flex flex-col justify-between gap-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
          <Icon size={20} className="fill-current" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-white/60 text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
