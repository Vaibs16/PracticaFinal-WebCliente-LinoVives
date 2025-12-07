'use client';

import { useState } from 'react';

const DECADES = [
    { id: '1950', label: '50s' },
    { id: '1960', label: '60s' },
    { id: '1970', label: '70s' },
    { id: '1980', label: '80s' },
    { id: '1990', label: '90s' },
    { id: '2000', label: '00s' },
    { id: '2010', label: '10s' },
    { id: '2020', label: '20s' },
];

export default function DecadeWidget({ onSelectionChange }) {
  const [selectedDecades, setSelectedDecades] = useState([]);

  const toggleDecade = (decadeId) => {
    let newSelection;
    if (selectedDecades.includes(decadeId)) {
      newSelection = selectedDecades.filter(id => id !== decadeId);
    } else {
      newSelection = [...selectedDecades, decadeId];
    }
    
    setSelectedDecades(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          Década
        </h3>

          <span className="text-xs font-normal text-gray-400">
            {selectedDecades.length}/5
          </span>
        
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {DECADES.map((decade) => {
          const isSelected = selectedDecades.includes(decade.id);
          return (
            <button
              key={decade.id}
              onClick={() => toggleDecade(decade.id)}
              className={`
                py-2 rounded-lg text-sm font-bold transition-all
                ${isSelected 
                  ? 'bg-green-500 text-black border-green-500' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
              `}
            >
              {decade.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Filtra los resultados por fecha de lanzamiento
      </p>
    </div>
  );
}