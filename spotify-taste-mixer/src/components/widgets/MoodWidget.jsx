'use client';

import { useState } from 'react';

export default function MoodWidget({ onSelectionChange }) {

  const DEFAULTS = {
    energy: 50,
    valence: 50,
    danceability: 50,
    acousticness: 50,
  };

  const [features, setFeatures] = useState(DEFAULTS); 
  const [activePreset, setActivePreset] = useState(null);

  // Presets configurados
  const PRESETS = {
    Happy: { 
      label: 'Feliz', 
      values: { energy: 80, valence: 90, danceability: 80, acousticness: 20 } 
    },
    Sad: { 
      label: 'Triste', 
      values: { energy: 30, valence: 10, danceability: 20, acousticness: 80 } 
    },
    Energetic: { 
      label: 'Energía', 
      values: { energy: 95, valence: 70, danceability: 90, acousticness: 0 } 
    },
    Calm: { 
      label: 'Calma', 
      values: { energy: 20, valence: 60, danceability: 10, acousticness: 90 } 
    },
  };

  const handleSliderChange = (key, value) => {
    const newFeatures = { ...features, [key]: parseInt(value) };
    setFeatures(newFeatures);
    setActivePreset(null);
    onSelectionChange(newFeatures);
  };

  const applyPreset = (presetKey) => {
    const values = PRESETS[presetKey].values;
    setFeatures(values);
    setActivePreset(presetKey);
    onSelectionChange(values);
  };

  const handleReset = () => {
    setFeatures(DEFAULTS); 
    setActivePreset(null); 
    onSelectionChange(DEFAULTS); 
  };

  // Configuración de las etiquetas de los 4 sliders
  const sliders = [
    { key: 'energy', label: 'Energía', min: 'Relax', max: 'Potente' },
    { key: 'valence', label: 'Positividad', min: 'Melancólico', max: 'Alegre' },
    { key: 'danceability', label: 'Bailabilidad', min: 'Estático', max: 'Fiesta' },
    { key: 'acousticness', label: 'Acústico', min: 'Digital/Elec.', max: 'Orgánico' },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        
        <h3 className="text-xl font-bold text-white">
          Mood
        </h3>

        <div className="flex items-center gap-3">
          
          <button 
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-white px-3 py-1 rounded transition-colors"
            title="Volver a valores neutros"
          >
            Reset
          </button>

          {activePreset && (
            <p className="text-xs bg-[#1DB954] text-black font-bold px-3 py-1 rounded-full ">
              {PRESETS[activePreset].label}
            </p>
          )}
        </div>
      </div>

      {/*Uso Object.keys para obtener solo la lista: ['Happy', 'Sad', 'Energetic'...] */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {Object.entries(PRESETS).map(([key, data]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={`
                py-2 rounded-lg text-sm font-bold transition-all
                ${activePreset === key 
                  ? 'bg-green-500 text-black border-green-500' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
              `}
          >
            {data.label}
          </button>
        ))}
      </div>

      {/*Sliders */}
      <div className="space-y-6">
        {sliders.map((s) => (
          <div key={s.key}>
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
              <p>{s.label}</p>
              <p className="text-white">{features[s.key]}%</p>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={features[s.key]}
              onChange={(e) => handleSliderChange(s.key, e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954] hover:accent-green-400"
            />
            
            <div className="flex justify-between text-[10px] text-gray-600 mt-1 uppercase tracking-wider">
              <p>{s.min}</p>
              <p>{s.max}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}