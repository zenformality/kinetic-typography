import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ArrowLeft } from 'lucide-react';
import type { Word, ThemeType } from '../types';

interface TypographyPlayerProps {
  audioUrl: string;
  words: Word[];
  theme: ThemeType;
  onBack: () => void;
}

export function TypographyPlayer({ audioUrl, words, theme, onBack }: TypographyPlayerProps) {
  const [time, setTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    const updateTime = () => {
      if (audioRef.current) {
        setTime(audioRef.current.currentTime);
        // Assuming the song is over if we're near the end or stopped after having started
        if (hasStarted && audioRef.current.ended) {
           setIsEnded(true);
        }
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };

    if (hasStarted && !isEnded) {
      animationFrameId = requestAnimationFrame(updateTime);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, isEnded]);

  const isDepressing = theme === 'depressing';
  const isHappy = theme === 'happy';

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.playbackRate = isDepressing ? 1.05 : isHappy ? 1.1 : 1.0;
      audioRef.current.play();
      setHasStarted(true);
      setIsEnded(false);
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = isDepressing ? 1.05 : isHappy ? 1.1 : 1.0;
      audioRef.current.play();
      setIsEnded(false);
    }
  };

  const wordsWithLayout = useMemo(() => {
    let cx = 0;
    let cy = 0;
    let crot = 0;
    return words.map((w, i) => {
      const pattern = i % 5;
      
      if (i > 0) {
        if (isDepressing) {
          // Slow, subtle drifting layout for depressing, not huge sweeping motion.
          if (pattern === 0) {
            cx += 400;
            cy -= 200;
            crot = -2;
          } else if (pattern === 1) {
            cy += 300;
            cx -= 200;
            crot = 3;
          } else if (pattern === 2) {
            cx += 240;
            cy -= 360;
            crot = 0;
          } else if (pattern === 3) {
            cy += 320;
            cx += 240;
            crot = -2;
          } else if (pattern === 4) {
            cx += 240;
            cy += 300;
            crot = 1;
          }
        } else if (isHappy) {
          // Playful, bouncy layout
          if (pattern === 0) {
            cx += 350;
            cy -= 200;
            crot = 8;
          } else if (pattern === 1) {
            cy += 300;
            cx -= 150;
            crot = -12;
          } else if (pattern === 2) {
            cx += 250;
            cy -= 250;
            crot = 10;
          } else if (pattern === 3) {
            cy += 200;
            cx += 250;
            crot = -8;
          } else if (pattern === 4) {
            cx += 200;
            cy += 180;
            crot = 15;
          }
        } else {
          // Larger kinetic typography layout shifts for sweeping camera motion (energetic)
          if (pattern === 0) {
            cx += 750;
            cy -= 250;
            crot = -5;
          } else if (pattern === 1) {
            cy += 600;
            cx -= 450;
            crot = 8;
          } else if (pattern === 2) {
            cx += 550;
            cy -= 500;
            crot = 0;
          } else if (pattern === 3) {
            cy += 500;
            cx += 550;
            crot = -8;
          } else if (pattern === 4) {
            cx += 450;
            cy += 500;
            crot = 4;
          }
        }
      }

      return {
        ...w,
        x: cx,
        y: cy,
        rot: crot,
        scale: w.isAccent ? (isDepressing ? 1.2 : isHappy ? 1.3 : 1.4) : 1
      };
    });
  }, [words, isDepressing, isHappy]);

  let activeWordIndex = wordsWithLayout.findIndex((w, i) => {
    const nextWord = wordsWithLayout[i+1];
    return time >= (w.timestamp || 0) && (!nextWord || time < (nextWord.timestamp || 0));
  });

  if (activeWordIndex === -1 && wordsWithLayout.length > 0 && time < (wordsWithLayout[0].timestamp || 0)) {
    activeWordIndex = 0;
  }

  const activeWord = activeWordIndex >= 0 ? wordsWithLayout[activeWordIndex] : wordsWithLayout[wordsWithLayout.length - 1];

  const camX = activeWord ? -activeWord.x : 0;
  const camY = activeWord ? -activeWord.y : 0;
  const camRot = activeWord ? -activeWord.rot : 0;
  const camScale = activeWord ? (1 / activeWord.scale) * (isDepressing ? 0.85 : isHappy ? 0.9 : 0.95) : 1; 

  const visibleWords = wordsWithLayout.filter((w, i) => {
    return Math.abs(i - activeWordIndex) < (isDepressing ? 15 : isHappy ? 20 : 30);
  });

  // Effects generator based on theme
  const rainDrops = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.8 + Math.random() * 0.5
  })), []);
  
  const flowers = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    size: 20 + Math.random() * 30,
    rot: Math.random() * 360,
    duration: 5 + Math.random() * 5
  })), []);

  const bgColor = isDepressing ? '#05070a' : isHappy ? '#1B4769' : '#0a0f08';
  const gridColor = isDepressing ? 'rgba(70,80,90,0.3)' : isHappy ? 'rgba(80, 127, 169, 0.2)' : 'rgba(175,214,155,1)';
  const accentColor = isDepressing ? '#8e8e93' : isHappy ? '#507FA9' : '#afd69b';
  const textColor = isDepressing ? 'rgba(255,255,255,0.6)' : isHappy ? '#E2EDF8' : 'white';

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center font-sans" style={{ backgroundColor: bgColor }}>
      <button 
        onClick={onBack}
        className="absolute z-50 top-6 left-6 text-white/50 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="uppercase text-xs font-bold tracking-widest">Back</span>
      </button>

      <audio 
        ref={audioRef} 
        src={audioUrl} 
        className="hidden"
      />

      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: isDepressing ? '30px 30px' : isHappy ? '40px 40px' : '60px 60px'
        }}
      ></div>

      {isDepressing && hasStarted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-30 z-0">
          {rainDrops.map(drop => (
            <div 
              key={`rain-${drop.id}`}
              className="absolute top-[-100px] w-[1px] h-[50px] bg-white animate-rain"
              style={{
                left: `${drop.left}%`,
                animationDelay: `${drop.delay}s`,
                animationDuration: `${drop.duration}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear'
              }}
            ></div>
          ))}
          {flowers.map(flower => (
            <div 
              key={`flower-${flower.id}`}
              className="absolute top-[-100px] text-zinc-600 grayscale opacity-40 animate-fall"
              style={{
                left: `${flower.left}%`,
                fontSize: `${flower.size}px`,
                animationDelay: `${flower.delay}s`,
                animationDuration: `${flower.duration}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear'
              }}
            >
              <div style={{ transform: `rotate(${flower.rot}deg)` }}>🥀</div>
            </div>
          ))}
        </div>
      )}

      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ backgroundColor: `${bgColor}e6` }}>
          <button 
            onClick={handleStart}
            className="flex flex-col items-center group"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500"
              style={{ backgroundColor: accentColor, color: bgColor, boxShadow: `0 0 80px ${accentColor}66` }}
            >
              <Play className="w-10 h-10 ml-2" />
            </div>
            <span className="text-xl tracking-widest uppercase font-bold transition-colors duration-500" style={{ color: `${accentColor}cc` }}>Play Edit</span>
          </button>
        </div>
      )}

      {isEnded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md animate-in fade-in" style={{ backgroundColor: `${bgColor}e6` }}>
          <button 
            onClick={handleReset}
            className="flex flex-col items-center group transition-colors duration-500"
            style={{ color: `${accentColor}80` }}
          >
            <RotateCcw className="w-12 h-12 mb-4 group-hover:-rotate-180 transition-transform duration-700" />
            <span className="text-xl tracking-widest uppercase font-bold hover:text-white" style={{ color: accentColor }}>Watch Again</span>
          </button>
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10">
        <motion.div
           className="absolute top-0 left-0"
           animate={{ rotate: camRot, scale: camScale }}
           transition={{ 
              type: "spring", 
              damping: isDepressing ? 40 : isHappy ? 20 : 25, 
              stiffness: isDepressing ? 60 : isHappy ? 120 : 150, 
              mass: isDepressing ? 2 : isHappy ? 0.8 : 1 
           }}
        >
           <motion.div
              className="absolute top-0 left-0"
              animate={{ x: camX, y: camY }}
              transition={{ 
                 type: "spring", 
                 damping: isDepressing ? 40 : isHappy ? 20 : 25, 
                 stiffness: isDepressing ? 60 : isHappy ? 120 : 150, 
                 mass: isDepressing ? 2 : isHappy ? 0.8 : 1 
              }}
           >
              {visibleWords.map(w => {
                 const age = time - (w.timestamp || 0);
                 const isActive = age >= 0 && age < (isDepressing ? 2.5 : isHappy ? 3.0 : 2.5); 
                 const isFuture = age < 0;
                 const isPast = age >= (isDepressing ? 2.5 : isHappy ? 3.0 : 2.5);

                 return (
                   <div key={w.id} className="absolute" style={{ transform: `translate3d(${w.x}px, ${w.y}px, 0)` }}>
                     <motion.div
                       className={`${isDepressing ? 'font-serif' : isHappy ? 'font-mono' : (w.isAccent ? 'font-calligraphy' : 'font-sans font-black')} ${isDepressing && w.isAccent ? 'italic' : (!isHappy || w.isAccent ? 'uppercase' : 'lowercase')} leading-none`}
                       style={{ 
                         x: "-50%", 
                         y: "-50%", 
                         rotate: w.rot, 
                         color: w.isAccent ? accentColor : textColor,
                         fontSize: isDepressing ? (w.isAccent ? '12rem' : '8rem') : isHappy ? (w.isAccent ? '10rem' : '7rem') : (w.isAccent ? '14rem' : '10rem'),
                         fontWeight: isHappy ? '800' : undefined,
                         textShadow: isDepressing 
                            ? '0 10px 30px rgba(0,0,0,0.9)'
                            : isHappy
                            ? (w.isAccent ? `0 0 60px ${accentColor}` : `0 10px 40px rgba(0,0,0,0.5)`)
                            : (w.isAccent ? `0 0 50px ${accentColor}66` : '0 15px 40px rgba(0,0,0,0.8)'),
                         whiteSpace: 'nowrap'
                       }}
                       initial={{ opacity: 0, scale: isDepressing ? 0.9 : 0.5 }}
                       animate={{
                         opacity: isFuture ? 0 : isPast ? 0 : (isDepressing ? 0.8 : 1),
                         scale: isFuture ? (isDepressing ? 0.9 : 0.3) : isPast ? (isDepressing ? 1.05 : isHappy ? 1.5 : 1.3) : w.scale,
                       }}
                       transition={{
                         opacity: { duration: isDepressing ? 0.8 : isHappy ? 0.2 : 0.1 },
                         scale: { type: "spring", damping: isDepressing ? 30 : isHappy ? 12 : 15, stiffness: isDepressing ? 50 : isHappy ? 250 : 200 },
                         filter: { duration: 1 }
                       }}
                     >
                       {w.text}
                     </motion.div>
                   </div>
                 );
              })}
           </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
