'use client';

export default function ResetPlaylistButton({ onReset }) {
  return (
    <button 
      onClick={onReset}
      className="text-xs flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors border border-gray-700 hover:border-red-400 px-3 py-1.5 rounded-full font-medium"
      title="Vaciar la playlist"
    >
      Borrar lista
    </button>
  );
}