'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    // Redirige a Spotify
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Spotify Taste Mixer</h1>

      <p className="text-gray-400 text-sm">Login</p>

      <button
        onClick={handleLogin}
        className="px-5 py-2 rounded-full bg-green-500 text-black font-semibold cursor-pointer"
      >
        Login con Spotify
      </button>
    </main>
  );
}