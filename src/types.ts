export interface Word {
  id: string;
  text: string;
  isAccent: boolean;
  timestamp: number | null;
}

export type AppStep = 'upload' | 'lyrics' | 'sync' | 'play';

export type ThemeType = 'energetic' | 'depressing' | 'happy';

export interface Song {
  id: string;
  title: string;
  audioUrl: string;
  lyricsUrl: string;
  theme: ThemeType;
}
