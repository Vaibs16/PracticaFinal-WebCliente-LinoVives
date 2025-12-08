'use client';

export default function TrackModal({ track, onClose }) {
  // Conseguir la imagen más grande (normalmente la primera del array)
  const largeImage = track.album.images[0].url;
  const releaseYear = track.album.release_date ? track.album.release_date.split('-')[0] : 'N/A';

  // Funcion que calcula la duracion de las canciones
  const realDuration = (ms) => {
    if (!ms) return '0:00';
    
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    // Si es menor que 10 le pongo un 0 a la izquierda
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  return (
    // Fondo
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      
      {/*Modal*/}
      <div 
        className="bg-[#181818] border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative flex flex-col items-center gap-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/*Botoón cerrar*/}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-black/20 rounded-full p-2 hover:cursor-pointer"
        >
          ✕
        </button>

        {/*Imagen*/}
        <div className="w-64 h-64 rounded-lg shadow-black/50 shadow-xl overflow-hidden mt-2">
          <img src={largeImage} alt={track.name} className="w-full h-full object-cover" />
        </div>

        {/*Textos */}
        <div className="text-center w-full">
          <h2 className="text-2xl font-bold text-white">{track.name}</h2>
          <p className="text-lg text-[#1DB954] font-medium mb-4">
            {track.artists.map(a => a.name).join(', ')}
          </p>

          <div className="bg-[#222] rounded-lg p-3 grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-bold">ÁLBUM</p>
              <p className="truncate">{track.album.name}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-bold">AÑO</p>
              <p>{releaseYear}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-bold">POPULARIDAD</p>
              {/*Popularidad */}
              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1.5">
                <div 
                  className="bg-green-500 h-full rounded-full" 
                  style={{ width: `${track.popularity}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-bold">DURACIÓN</p>
              <p>{realDuration(track.duration_ms)}</p>
            </div>
          </div>
        </div>

        {/*Link a spotify */}
        <a 
          href={track.external_urls.spotify} 
          target="_blank" 
          className="w-full mt-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3 rounded-full text-center transition-transform hover:scale-105"
        >
          Escuchar en Spotify
        </a>
      </div>
    </div>
  );
}