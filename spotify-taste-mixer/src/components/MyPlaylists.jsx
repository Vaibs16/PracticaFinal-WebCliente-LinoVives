import { useState } from 'react';

export default function MyPlaylists({ savedPlaylists, onDelete, onTrackClick }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (savedPlaylists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
        <p>No tienes playlists guardadas aún.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {savedPlaylists.map((playlist) => (
        <div 
          key={playlist.id} 
          className="bg-[#181818] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all flex flex-col"
        >
          <div className="p-5 bg-[#181818]">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white truncate pr-2" title={playlist.name}>
                {playlist.name}
              </h3>
              <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(playlist.id); 
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Borrar playlist"
              >
                Eliminar
              </button>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <p>{playlist.tracks.length} canciones</p>
              <p>{new Date(playlist.date).toLocaleDateString()}</p>
            </div>
          </div>

          <button 
            onClick={() => toggleExpand(playlist.id)}
            className="w-full bg-[#282828] hover:bg-[#333] text-white py-3 text-xs font-bold transition-colors border-t border-gray-800"
          >
            {expandedId === playlist.id ? '▲ Ocultar Canciones' : '▼ Ver Canciones'}
          </button>

          {expandedId === playlist.id && (
            <div className="bg-[#121212] border-t border-gray-800 max-h-60 overflow-y-auto custom-scrollbar p-2">
              {playlist.tracks.map((track, index) => (
                <div 
                  key={`${playlist.id}-${track.id}-${index}`}
                  onClick={() => onTrackClick(track)}
                  className="flex items-center gap-3 p-2 hover:bg-[#282828] rounded cursor-pointer group"
                >
                  <img src={track.album.images[0].url} alt="" className="w-8 h-8 rounded" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-white truncate group-hover:text-[#1DB954]">{track.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{track.artists[0].name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}