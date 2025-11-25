"use client";
import { useState } from "react";

export default function Dashboard() {
  const [playlist, setPlaylist] = useState([]);  

  const handleGenerate = () => {
    console.log("Generar playlist (lógica pendiente)");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <button
        onClick={handleGenerate}
        className="mt-4 px-5 py-2 rounded-full bg-green-500 text-black font-semibold cursor-pointer"
      >
        Generar playlist
      </button>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Playlist generada</h2>

        {playlist.length === 0 ? (
          <p className="text-gray-400 mt-2">Aún no hay canciones.</p>
        ) : (
          <p className="mt-2"> Canciones</p>
        )}
      </section>
    </div>
  );
}
