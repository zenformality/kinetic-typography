import { Word } from '../types';

export function parseLrc(lrcText: string): Word[] {
  const lines = lrcText.split('\n');
  const words: Word[] = [];
  
  // Matches [mm:ss.xx] or [mm:ss.xxx]
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  
  const parsedLines: { time: number; text: string }[] = [];
  
  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      let msStr = match[3];
      if (msStr.length === 2) msStr += '0';
      const ms = parseInt(msStr, 10);
      
      const timeInSeconds = min * 60 + sec + ms / 1000;
      const text = line.replace(timeRegex, '').trim();
      
      if (text && !text.startsWith('ar:') && !text.startsWith('ti:') && !text.startsWith('al:')) {
        parsedLines.push({ time: timeInSeconds, text });
      }
    }
  }

  for (let i = 0; i < parsedLines.length; i++) {
    const currentLine = parsedLines[i];
    const nextTime = i + 1 < parsedLines.length ? parsedLines[i+1].time : currentLine.time + 3.0;
    
    // We split current line by spaces to simulate word-level sync
    const tokens = currentLine.text.split(/\s+/).filter(t => t.length > 0);
    if (tokens.length === 0) continue;
    
    const duration = Math.max(0, nextTime - currentLine.time);
    // Cap the time per word so short phrases don't stretch endlessly during instrumental breaks
    const timePerWord = Math.min(0.5, duration / Math.max(1, tokens.length));
    
    tokens.forEach((token, index) => {
      let isAccent = false;
      let cleanText = token;
      
      if (cleanText.startsWith('*') && cleanText.endsWith('*')) {
        isAccent = true;
        cleanText = cleanText.slice(1, -1);
      } else if (cleanText.length > 0) {
          // Remove parentheses for cleaner typography but keep text
          cleanText = cleanText.replace(/^[()]+|[()]+$/g, '');
      }
      
      // Enhance typography by arbitrarily emphasizing longer words 
      if (!isAccent && cleanText.replace(/[^a-zA-Z]/g, '').length >= 6) {
        isAccent = true;
      }

      if (cleanText.toLowerCase() === 'her' || cleanText.toLowerCase() === 'herrrrrrrrrr') {
         cleanText = 'herrrrrrrrrr';
         isAccent = true;
      }
      
      words.push({
        id: Math.random().toString(36).substring(2, 10) + index,
        text: cleanText,
        isAccent,
        timestamp: currentLine.time + (index * timePerWord)
      });
    });
  }
  
  return words;
}
