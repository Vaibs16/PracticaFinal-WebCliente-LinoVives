'use client';

export default function Favorites({ favorites, onToggleFavorite, onTrackClick }) {
  
  // Si no hay favoritos aviso 
  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-300 mb-2">Tu colección está vacía</h3>
        <p className="text-sm max-w-md text-center">
          Vuelve al Mixer, busca canciones que te gusten y pulsa la estrella (☆) para guardarlas aquí.
        </p>
      </div>
    );
  }

  return (
    <div>
      
      <div className="flex items-center gap-3 pb-6">
        <h2 className="text-2xl font-bold text-white">Tu Colección</h2>
        <span className="bg-[#1DB954] text-black text-xs font-bold p-2 rounded-full">
          {favorites.length} canciones
        </span>
      </div>

      {/*canciones*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((track) => (
          <div 
            key={track.id} 
            className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-xl transition-all border border-transparent hover:border-gray-700 flex items-center gap-4 relative"
            onClick={() => onTrackClick(track)}
          >
            {/*Imagen */}
            <div className="w-16 h-16 shrink-0 shadow-lg">
              <img 
                src={track.album.images[0].url} 
                alt={track.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            {/*Informacion*/}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm truncate" title={track.name}>
                {track.name}
              </h3>
              <p className="text-xs text-gray-400 truncate">
                {track.artists.map(a => a.name).join(', ')}
              </p>
            </div>

            {/*Quitar favoritos*/}
            <button
              onClick={(e) => {
                onToggleFavorite(track)
                e.stopPropagation()
              }}
              className="text-yellow-500 hover:text-red-500 p-2"
              title="Quitar de favoritos"
            >
              ★
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}