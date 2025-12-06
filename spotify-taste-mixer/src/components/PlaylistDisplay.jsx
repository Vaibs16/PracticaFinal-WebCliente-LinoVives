'use client';

export default function PlaylistDisplay({ playlist, onGenerate, isGenerating, disabled, onRemoveTrack }) {
  
  // Función auxiliar para obtener imagen
  const getTrackImage = (track) => {
    if (track.album && track.album.images && track.album.images.length > 0) {
      return track.album.images[0].url;
    }
    return 'https://via.placeholder.com/40';
  };

  // CSS Para el boton 
  const baseStyle = "w-full py-3 rounded-full font-bold text-black";

  const colorStyle = (disabled || isGenerating) 
    ? "bg-gray-600 cursor-not-allowed"       // Bloqueado
    : "bg-green-500 hover:bg-green-400";     // Activo 

  const buttonClass = `${baseStyle} ${colorStyle}`;

  return (
    <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex flex-col shadow-2xl h-[calc(100vh-140px)]">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        Playlist Generada
        {playlist.length > 0 && (
          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
            {playlist.length}
          </span>
        )}
      </h2>

      {/* Lista de canciones con scroll */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
        {playlist.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center text-sm">
            <p className="mb-2">Selecciona tus widgets y pulsa generar.</p>
          </div>
        ) : (
          playlist.map((track) => (
            <div key={track.id} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-md transition group relative">
              <img 
                src={getTrackImage(track)} 
                alt={track.name}
                className="w-10 h-10 rounded shadow" 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{track.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {track.artists.map(a => a.name).join(", ")}
                </p>
              </div>
              
              {/* Botón para eliminar canción*/}
              <button 
                onClick={() => onRemoveTrack(track.id)}
                className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                title="Eliminar canción"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Botón de generar playlist */}
      
      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={buttonClass}
      >
        {isGenerating ? "Generando..." : "GENERAR PLAYLIST"}
      </button>
    </div>
  );
}