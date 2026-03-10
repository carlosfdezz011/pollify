import { Home, Search, Library, Sparkles, Plus, SlidersHorizontal } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'search', icon: Search, label: 'Buscar' },
    { id: 'library', icon: Library, label: 'Tu Biblioteca' },
    { id: 'ai-dj', icon: Sparkles, label: 'AI DJ Mix' },
    { id: 'manual-mix', icon: SlidersHorizontal, label: 'Mezcla Manual' },
  ];

  return (
    <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 h-full flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent tracking-tighter">
          Pollifay
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-400 shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : ''} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Plus size={16} />
          </div>
          <span className="font-medium text-sm">Crear Playlist</span>
        </button>
      </div>
    </div>
  );
}
