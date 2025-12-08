'use client';

export default function ResetFiltersButton({ onReset }) {
  return (
    <button 
      onClick={onReset} 
      className="text-xs flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors border border-gray-700 hover:border-red-400 px-4 py-2 rounded-full font-medium"
      title="Reiniciar los filtros de búsqueda"
    >
      Borrar filtros
    </button>
  );
}