'use client';

export default function Header({ view, setView, favoritesCount, onLogout }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-4 gap-4">
        
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Spotify <span className="text-[#1DB954]">Mixer</span>
      </h1>

      {/*Pestañas*/}
      <nav className="flex bg-[#222] p-1 rounded-full">
        {/*Botón Mixer */}
        <button 
          onClick={() => setView('home')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            view === 'home' 
              ? 'bg-[#1DB954] text-black shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Mixer
        </button>

        {/*Botón Favoritos*/}
        <button 
          onClick={() => setView('favorites')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
            view === 'favorites' 
              ? 'bg-[#1DB954] text-black shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Favoritos
          {favoritesCount > 0 && (
            <p className="text-xs bg-black/30 px-2 rounded-full">
              {favoritesCount}
            </p>
          )}
        </button>
      </nav>

      {/*Cerrar sesion */}
      <button 
        onClick={onLogout} 
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        Cerrar Sesión
      </button>
    </header>
  );
}