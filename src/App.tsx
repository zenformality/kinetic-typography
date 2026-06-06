import React, { useState, useEffect } from 'react';
import type { Word, Song } from './types';
import { TypographyPlayer } from './components/TypographyPlayer';
import { parseLrc } from './utils/lrcParser';
import { Loader2, Music2 } from 'lucide-react';

const SONGS: Song[] = [
  { id: '1', title: 'Her', audioUrl: '/audio.mp3', lyricsUrl: '/her.lrc', theme: 'energetic' },
  { id: '2', title: 'Raindance', audioUrl: '/audio2.mp3', lyricsUrl: '/lyrics2.lrc', theme: 'depressing' },
  { id: '3', title: 'Made in Japan', audioUrl: '/audio3.mp3', lyricsUrl: '/lyrics3.lrc', theme: 'happy' }
];

export default function App() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSong) return;

    async function loadLyrics() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(selectedSong!.lyricsUrl);
        if (!response.ok) {
          throw new Error(`Could not find ${selectedSong!.lyricsUrl}`);
        }
        const text = await response.text();
        const parsed = parseLrc(text);
        setWords(parsed);
      } catch (err: any) {
        console.error(err);
        setError(`Failed to load ${selectedSong!.lyricsUrl}. Please ensure the file exists in the public directory.`);
      } finally {
        setLoading(false);
      }
    }
    loadLyrics();
  }, [selectedSong]);

  if (!selectedSong) {
    return (
      <div className="w-full min-h-screen bg-[#0a0f08] flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
          <Music2 className="w-10 h-10 text-[#afd69b]" />
          Select a Track
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {SONGS.map(song => (
            <button
              key={song.id}
              onClick={() => setSelectedSong(song)}
              className={`p-8 rounded-2xl border transition-all text-left group ${
                song.theme === 'energetic' 
                  ? 'bg-[#afd69b]/10 border-[#afd69b]/20 hover:border-[#afd69b]' 
                  : song.theme === 'happy'
                  ? 'bg-[#507FA9]/10 border-[#507FA9]/20 hover:border-[#507FA9]'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <h2 className={`text-2xl font-bold mb-2 group-hover:scale-105 transition-transform ${
                song.theme === 'energetic' ? 'text-[#afd69b]' : song.theme === 'happy' ? 'text-[#507FA9]' : 'text-zinc-400 font-serif'
              }`}>
                {song.title}
              </h2>
              <p className="text-zinc-500 text-sm">Theme: {song.theme}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#0a0f08] flex items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#afd69b]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-[#0a0f08] flex flex-col items-center justify-center text-white p-8">
        <div className="max-w-md text-center">
          <p className="text-xl text-red-400 mb-4">{error}</p>
          <p className="text-zinc-500 text-sm mb-8">
            Upload your `{selectedSong.audioUrl.replace('/', '')}` and `{selectedSong.lyricsUrl.replace('/', '')}` via the file explorer into the `public` folder.
          </p>
          <button 
            onClick={() => setSelectedSong(null)}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
          >
            ← Back to Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#0a0f08]">
      <TypographyPlayer 
        audioUrl={selectedSong.audioUrl} 
        words={words} 
        theme={selectedSong.theme}
        onBack={() => setSelectedSong(null)}
      />
    </div>
  );
}
