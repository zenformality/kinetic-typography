import { Word } from '../types';

export function parseSrt(srtText: string): Word[] {
  const words: Word[] = [];
  
  // Normalize line endings
  const text = srtText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split by double newline to get blocks
  const blocks = text.split(/\n\n+/);
  
  const parsedLines: { startTime: number; endTime: number; text: string }[] = [];
  
  for (const block of blocks) {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Find the line that looks like a timeline
    const timeLineIndex = lines.findIndex(line => 
      line.match(/(\d+):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d+):(\d{2}):(\d{2})[,.](\d{3})/)
    );

    if (timeLineIndex !== -1) {
      const timeLine = lines[timeLineIndex];
      const match = timeLine.match(/(\d+):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d+):(\d{2}):(\d{2})[,.](\d{3})/);
      
      if (match) {
        const startH = parseInt(match[1], 10);
        const startM = parseInt(match[2], 10);
        const startS = parseInt(match[3], 10);
        const startMs = parseInt(match[4], 10);
        const startTime = startH * 3600 + startM * 60 + startS + startMs / 1000;
        
        const endH = parseInt(match[5], 10);
        const endM = parseInt(match[6], 10);
        const endS = parseInt(match[7], 10);
        const endMs = parseInt(match[8], 10);
        const endTime = endH * 3600 + endM * 60 + endS + endMs / 1000;
        
        const textLines = lines.slice(timeLineIndex + 1).join(' ');
        
        parsedLines.push({ startTime, endTime, text: textLines });
      }
    }
  }

  for (let i = 0; i < parsedLines.length; i++) {
    const currentLine = parsedLines[i];
    
    // We split current line by spaces to simulate word-level sync
    const tokens = currentLine.text.split(/\s+/).filter(t => t.length > 0);
    if (tokens.length === 0) continue;
    
    const duration = currentLine.endTime - currentLine.startTime;
    // We distribute words over the duration of the line.
    // We leave a small gap just so the last word doesn't stretch entirely.
    const timePerWord = duration / tokens.length;
    
    tokens.forEach((token, index) => {
      let isAccent = false;
      let cleanText = token;
      
      if (token.startsWith('*') && token.endsWith('*')) {
        isAccent = true;
        cleanText = token.slice(1, -1);
      }
      
      // Enhance typography by arbitrarily emphasizing longer words 
      // if no accents were explicitly defined in the srt.
      if (!isAccent && cleanText.replace(/[^a-zA-Z]/g, '').length >= 6) {
        // Let's add an accent to some long words for visual dramatic effect
        isAccent = true;
      }
      
      words.push({
        id: Math.random().toString(36).substring(2, 9) + index,
        text: cleanText,
        isAccent,
        timestamp: currentLine.startTime + (index * timePerWord)
      });
    });
  }
  
  return words;
}
