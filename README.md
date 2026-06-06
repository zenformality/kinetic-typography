# Kinetic

Kinetic is an immersive typography-based music player. It synchronizes music with `.lrc` lyric files to create dynamic, moving textual performances. Each track brings its own visual theme—dictating colors, typography scale, spacing, and the "camera" motion through the lyrics.

## Features

- **Kinetic Typography:** Lyrics are animated in 3D space, gracefully bringing the text in and out of focus synchronously with the music.
- **Thematic Experiences:**
  - **Energetic (Her):** Sweeping camera motions, large kinetic shifts, and a sharp, vibrant green-and-black palette.
  - **Depressing (Raindance):** Slower, subtle drifting layouts, ambient drop logic, falling effects, and a somber grayscale/dim dark ambiance.
  - **Happy (Made in Japan):** Bouncy and playful layouts, floating bubble animations, aesthetic blue colorway (`#1B4769` backgrounds with `#507FA9` highlights), and bold, uppercase/lowercase mixtures.
- **.LRC Syncing:** Automatically parses timestamps out of standard `.lrc` files to match the song's audio dynamically.

## How to use

1. Place your audio files (e.g., `audio.mp3`, `audio2.mp3`, `audio3.mp3`) and corresponding `.lrc` lyrics files (e.g., `her.lrc`, `lyrics2.lrc`, `lyrics3.lrc`) in the `/public` directory.
2. Select your track from the menu.
3. Enjoy the visual typography experience while the music plays.

## Tech Stack

- **React:** UI Architecture.
- **Vite:** Local development and bundling.
- **Tailwind CSS:** Comprehensive styling and layout configuration.
- **Motion (framer-motion):** Spring physics and fluid animations driving the "camera" and text states.
- **Lucide Icons:** Clean UI icons.

## Adding Custom Songs

To add custom tracks, upload your `<song>.mp3` and `<lyrics>.lrc` files into the `/public` directory via the file explorer, then add an entry into the `SONGS` array inside `/src/App.tsx` defining the appropriate theme!
