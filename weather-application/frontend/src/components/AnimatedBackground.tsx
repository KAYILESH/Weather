import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../store/weatherStore';

interface AnimatedBackgroundProps {
  weatherMain?: string;
}

/* ─────────────────────────────────────────────────────────────
   GRADIENT MAPS
───────────────────────────────────────────────────────────── */
const DARK_GRADIENTS: Record<string, string> = {
  clear:       'linear-gradient(160deg, #030718 0%, #0b1a3e 40%, #1a1060 100%)',
  clouds:      'linear-gradient(160deg, #111827 0%, #1e293b 50%, #334155 100%)',
  rain:        'linear-gradient(160deg, #05080f 0%, #0a1128 50%, #0c1e4a 100%)',
  drizzle:     'linear-gradient(160deg, #0d1117 0%, #1a243a 50%, #1e2d55 100%)',
  thunderstorm:'linear-gradient(160deg, #020308 0%, #08050f 50%, #12091c 100%)',
  snow:        'linear-gradient(160deg, #0d1b2a 0%, #1e2f45 50%, #243550 100%)',
  mist:        'linear-gradient(160deg, #111827 0%, #1c2636 50%, #1e293b 100%)',
  fog:         'linear-gradient(160deg, #111827 0%, #1c2636 50%, #1e293b 100%)',
  haze:        'linear-gradient(160deg, #1a0a00 0%, #2d1500 50%, #1a0f00 100%)',
  dust:        'linear-gradient(160deg, #1c1200 0%, #2e1f00 50%, #1c1500 100%)',
  sand:        'linear-gradient(160deg, #1c1200 0%, #2e1f00 50%, #1c1500 100%)',
  ash:         'linear-gradient(160deg, #141414 0%, #1e1e1e 50%, #111111 100%)',
  squall:      'linear-gradient(160deg, #050a14 0%, #0c1a2e 50%, #0a1528 100%)',
  tornado:     'linear-gradient(160deg, #050810 0%, #0a1220 50%, #08101e 100%)',
  smoke:       'linear-gradient(160deg, #0a0a0a 0%, #151515 50%, #0d0d0d 100%)',
  default:     'linear-gradient(160deg, #030718 0%, #0b1a3e 40%, #1a1060 100%)',
};

const LIGHT_GRADIENTS: Record<string, string> = {
  clear:       'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 40%, #cbd5e1 100%)',
  clouds:      'linear-gradient(160deg, #e8eaf0 0%, #d1d9e6 50%, #b8c4d4 100%)',
  rain:        'linear-gradient(160deg, #8fa8c8 0%, #6b8cae 50%, #4a6e94 100%)',
  drizzle:     'linear-gradient(160deg, #9ab0c8 0%, #7a96b0 50%, #6080a0 100%)',
  thunderstorm:'linear-gradient(160deg, #4a5568 0%, #374151 50%, #2d3748 100%)',
  snow:        'linear-gradient(160deg, #f0f4f8 0%, #e2eaf4 50%, #d0dcea 100%)',
  mist:        'linear-gradient(160deg, #d8e0ea 0%, #c4cedb 50%, #aebccc 100%)',
  fog:         'linear-gradient(160deg, #d8e0ea 0%, #c4cedb 50%, #aebccc 100%)',
  haze:        'linear-gradient(160deg, #f5e0b0 0%, #e8cc88 50%, #d4b870 100%)',
  dust:        'linear-gradient(160deg, #e8d090 0%, #d4b870 50%, #c0a050 100%)',
  sand:        'linear-gradient(160deg, #e8d090 0%, #d4b870 50%, #c0a050 100%)',
  ash:         'linear-gradient(160deg, #c8c8c8 0%, #b4b4b4 50%, #a0a0a0 100%)',
  squall:      'linear-gradient(160deg, #606888 0%, #4a5270 50%, #384060 100%)',
  tornado:     'linear-gradient(160deg, #506070 0%, #3c4c5c 50%, #2c3c4c 100%)',
  smoke:       'linear-gradient(160deg, #888888 0%, #707070 50%, #606060 100%)',
  default:     'linear-gradient(160deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ weatherMain }) => {
  const theme = useWeatherStore((state) => state.theme);
  const isLight = theme === 'light';
  const condition = weatherMain?.toLowerCase() || 'default';

  const gradientMap = isLight ? LIGHT_GRADIENTS : DARK_GRADIENTS;
  const gradient = gradientMap[condition] || gradientMap.default;

  /* ── Generate particle arrays once on mount ── */
  const rainDrops = useMemo(() =>
    Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${(i / 80) * 100 + Math.random() * 1.5}%`,
      delay: Math.random() * 2.5,
      duration: 0.45 + Math.random() * 0.6,
      opacity: 0.3 + Math.random() * 0.5,
      width: Math.random() > 0.7 ? 2 : 1.5,
    })), []);

  const heavyRainDrops = useMemo(() =>
    Array.from({ length: 140 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 1.5,
      duration: 0.25 + Math.random() * 0.35,
    })), []);

  const snowFlakes = useMemo(() =>
    Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 5,
      delay: Math.random() * 6,
      duration: 5 + Math.random() * 6,
      wobble: 15 + Math.random() * 30,
    })), []);

  const stars = useMemo(() =>
    Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 65}%`,
      size: 0.8 + Math.random() * 1.8,
      duration: 2 + Math.random() * 4,
    })), []);

  const dustParticles = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${10 + Math.random() * 80}%`,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
      size: 2 + Math.random() * 5,
      opacity: 0.2 + Math.random() * 0.4,
    })), []);

  const smokeParticles = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 8,
      size: 60 + Math.random() * 100,
    })), []);

  const fogStripes = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      top: `${5 + i * 12}%`,
      delay: i * 1.2,
      duration: 12 + i * 3,
      opacity: 0.06 + Math.random() * 0.12,
      height: 40 + Math.random() * 60,
    })), []);

  /* ── Lightning state ── */
  const [lightning, setLightning] = useState(false);
  const [lightningBolt, setLightningBolt] = useState<{ x: number; skew: number } | null>(null);

  useEffect(() => {
    if (condition !== 'thunderstorm') return;
    const triggerLightning = () => {
      const x = 20 + Math.random() * 60;
      const skew = -5 + Math.random() * 10;
      setLightningBolt({ x, skew });
      setLightning(true);
      setTimeout(() => setLightning(false), 80 + Math.random() * 100);
      if (Math.random() > 0.4) {
        setTimeout(() => {
          setLightning(true);
          setTimeout(() => setLightning(false), 50 + Math.random() * 70);
        }, 180 + Math.random() * 120);
      }
    };
    const interval = setInterval(() => {
      if (Math.random() > 0.45) triggerLightning();
    }, 3500 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [condition]);

  /* ── Sun ray rotation ── */
  const isClear = condition === 'clear' || condition === 'default';

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: gradient, transition: 'background 1.5s ease' }}
    >
      {/* ── CLEAR / SUNNY – minimal light (no sun decoration) ── */}
      {isClear && isLight && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle cool light shimmer only */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 60% 0%, rgba(186,230,255,0.22) 0%, transparent 70%)' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* ── CLEAR NIGHT – Stars & Moon ── */}
      {isClear && !isLight && (
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star) => (
            <motion.div
              key={`star-${star.id}`}
              className="absolute rounded-full bg-white"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                boxShadow: star.size > 1.4 ? '0 0 6px 2px rgba(255,255,255,0.7)' : 'none',
              }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [1, 1.3, 1] }}
              transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {/* Moon */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 80,
              height: 80,
              top: '8%',
              right: '10%',
              background: 'radial-gradient(circle at 35% 35%, #fffff0 0%, #d4e4f7 60%, #8ab4d8 100%)',
              boxShadow: '0 0 30px 10px rgba(180,210,255,0.25)',
            }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Shooting stars */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`shoot-${i}`}
              className="absolute h-px rounded-full"
              style={{
                width: 80 + i * 20,
                top: `${8 + i * 15}%`,
                left: '-80px',
                background: 'linear-gradient(to right, transparent, white, transparent)',
                opacity: 0,
              }}
              animate={{ x: ['0vw', '120vw'], opacity: [0, 0.9, 0] }}
              transition={{
                duration: 1.2,
                delay: 4 + i * 7,
                repeat: Infinity,
                repeatDelay: 15 + i * 8,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}

      {/* ── CLOUDS ── */}
      {(condition === 'clouds') && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { w: 500, h: 140, top: '5%', blur: 60, speed: 200, from: '-600px', opacity: 0.35 },
            { w: 700, h: 180, top: '15%', blur: 80, speed: 280, from: '110vw', opacity: 0.28 },
            { w: 400, h: 120, top: '28%', blur: 50, speed: 160, from: '-500px', opacity: 0.25 },
            { w: 600, h: 160, top: '40%', blur: 70, speed: 240, from: '110vw', opacity: 0.20 },
          ].map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: c.w,
                height: c.h,
                top: c.top,
                filter: `blur(${c.blur}px)`,
                background: isLight
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(100,116,139,0.5)',
                opacity: c.opacity,
              }}
              animate={{
                x: i % 2 === 0 ? [c.from, '120vw'] : ['120vw', c.from],
              }}
              transition={{ duration: c.speed, repeat: Infinity, ease: 'linear', delay: i * 12 }}
            />
          ))}
          {/* Cloud puff shapes */}
          {[
            { size: 180, top: '8%', left: '10%' },
            { size: 220, top: '12%', left: '55%' },
            { size: 150, top: '20%', left: '30%' },
          ].map((puff, i) => (
            <motion.div
              key={`puff-${i}`}
              className="absolute rounded-full"
              style={{
                width: puff.size,
                height: puff.size * 0.6,
                top: puff.top,
                left: puff.left,
                background: isLight
                  ? 'radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.6) 100%)'
                  : 'radial-gradient(ellipse, rgba(71,85,105,0.6) 0%, rgba(51,65,85,0.2) 100%)',
                filter: 'blur(15px)',
              }}
              animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
              transition={{ duration: 15 + i * 5, repeat: Infinity, ease: 'easeInOut', delay: i * 3 }}
            />
          ))}
        </div>
      )}

      {/* ── DRIZZLE ── */}
      {condition === 'drizzle' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {rainDrops.slice(0, 40).map((drop) => (
            <motion.div
              key={`drizzle-${drop.id}`}
              className="absolute rounded-full"
              style={{
                left: drop.left,
                width: 1,
                height: 8,
                top: '-20px',
                background: isLight ? 'rgba(100,150,220,0.4)' : 'rgba(180,210,255,0.3)',
              }}
              animate={{ y: ['0vh', '105vh'], x: ['0px', '-6px'] }}
              transition={{
                duration: drop.duration * 1.8,
                delay: drop.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* ── RAIN ── */}
      {condition === 'rain' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {rainDrops.map((drop) => (
            <motion.div
              key={`rain-${drop.id}`}
              className="absolute rounded-full"
              style={{
                left: drop.left,
                width: drop.width,
                height: 20,
                top: '-30px',
                background: isLight
                  ? `rgba(50,130,210,${drop.opacity * 0.7})`
                  : `rgba(150,200,255,${drop.opacity})`,
                boxShadow: isLight ? 'none' : '0 0 2px rgba(150,200,255,0.3)',
              }}
              animate={{ y: ['0vh', '110vh'], x: ['0px', '-15px'] }}
              transition={{ duration: drop.duration, delay: drop.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {/* Rain mist overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? 'linear-gradient(to bottom, transparent 60%, rgba(80,120,180,0.08))'
                : 'linear-gradient(to bottom, transparent 60%, rgba(30,60,120,0.2))',
            }}
          />
        </div>
      )}

      {/* ── THUNDERSTORM ── */}
      {condition === 'thunderstorm' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Heavy rain */}
          {heavyRainDrops.map((drop) => (
            <motion.div
              key={`storm-${drop.id}`}
              className="absolute rounded-full"
              style={{
                left: drop.left,
                width: 1.5,
                height: 30,
                top: '-40px',
                background: 'rgba(140,185,255,0.45)',
              }}
              animate={{ y: ['0vh', '112vh'], x: ['0px', '-50px'] }}
              transition={{ duration: drop.duration, delay: drop.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* Lightning flash */}
          <motion.div
            className="absolute inset-0 bg-white z-20"
            animate={{ opacity: lightning ? 0.88 : 0 }}
            transition={{ duration: 0.04 }}
          />

          {/* Lightning bolt SVG */}
          <AnimatePresence>
            {lightning && lightningBolt && (
              <motion.svg
                key="bolt"
                className="absolute z-20 pointer-events-none"
                style={{ left: `${lightningBolt.x}%`, top: 0, width: 60, height: '60vh', skewX: lightningBolt.skew }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                viewBox="0 0 60 300"
                fill="none"
              >
                <polyline
                  points="35,0 20,120 38,120 10,300"
                  stroke="rgba(255,255,200,0.95)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Dark storm clouds */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`stcloud-${i}`}
              className="absolute rounded-full"
              style={{
                width: 500 + i * 150,
                height: 120 + i * 30,
                top: `${i * 12}%`,
                background: `rgba(${15 + i * 5},${18 + i * 5},${25 + i * 5},0.7)`,
                filter: `blur(${50 + i * 15}px)`,
              }}
              animate={{ x: i % 2 === 0 ? ['-600px', '110vw'] : ['110vw', '-600px'] }}
              transition={{ duration: 90 + i * 30, repeat: Infinity, ease: 'linear', delay: i * 8 }}
            />
          ))}
        </div>
      )}

      {/* ── SNOW ── */}
      {condition === 'snow' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {snowFlakes.map((flake) => (
            <motion.div
              key={`flake-${flake.id}`}
              className="absolute rounded-full"
              style={{
                left: flake.left,
                width: flake.size,
                height: flake.size,
                top: '-20px',
                background: isLight
                  ? 'rgba(200,225,255,0.9)'
                  : 'rgba(255,255,255,0.85)',
                filter: flake.size > 4.5 ? 'blur(0.6px)' : 'none',
                boxShadow: flake.size > 3 ? '0 0 4px rgba(200,225,255,0.6)' : 'none',
              }}
              animate={{
                y: ['0vh', '108vh'],
                x: [`0px`, `${flake.wobble}px`, `-${flake.wobble / 2}px`, `${flake.wobble / 3}px`],
              }}
              transition={{
                duration: flake.duration,
                delay: flake.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
          {/* Snow ground glow */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '25%',
              background: isLight
                ? 'linear-gradient(to top, rgba(220,235,255,0.3), transparent)'
                : 'linear-gradient(to top, rgba(100,140,200,0.12), transparent)',
            }}
          />
        </div>
      )}

      {/* ── MIST / FOG ── */}
      {(condition === 'mist' || condition === 'fog') && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {fogStripes.map((stripe) => (
            <motion.div
              key={`fog-${stripe.id}`}
              className="absolute left-0 right-0"
              style={{
                top: stripe.top,
                height: stripe.height,
                background: isLight
                  ? `rgba(200,215,235,${stripe.opacity * 3})`
                  : `rgba(80,100,130,${stripe.opacity})`,
                filter: 'blur(25px)',
              }}
              animate={{
                x: stripe.id % 2 === 0 ? ['-10%', '10%', '-10%'] : ['10%', '-10%', '10%'],
                opacity: [stripe.opacity, stripe.opacity * 2, stripe.opacity],
              }}
              transition={{ duration: stripe.duration, delay: stripe.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {/* Overall fog overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: isLight
                ? 'rgba(200,215,235,0.25)'
                : 'rgba(40,55,80,0.3)',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* ── HAZE ── */}
      {condition === 'haze' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {fogStripes.map((stripe) => (
            <motion.div
              key={`haze-${stripe.id}`}
              className="absolute left-0 right-0"
              style={{
                top: stripe.top,
                height: stripe.height * 1.5,
                background: isLight
                  ? `rgba(220,180,80,${stripe.opacity * 2.5})`
                  : `rgba(120,70,10,${stripe.opacity * 2})`,
                filter: 'blur(30px)',
              }}
              animate={{
                x: stripe.id % 2 === 0 ? ['-8%', '8%', '-8%'] : ['8%', '-8%', '8%'],
                opacity: [stripe.opacity, stripe.opacity * 1.5, stripe.opacity],
              }}
              transition={{ duration: stripe.duration * 1.5, delay: stripe.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          <motion.div
            className="absolute inset-0"
            style={{
              background: isLight
                ? 'rgba(200,150,40,0.15)'
                : 'rgba(80,40,0,0.35)',
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* ── DUST / SAND ── */}
      {(condition === 'dust' || condition === 'sand') && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {dustParticles.map((p) => (
            <motion.div
              key={`dust-${p.id}`}
              className="absolute rounded-full"
              style={{
                top: p.top,
                left: '-20px',
                width: p.size,
                height: p.size,
                background: isLight
                  ? `rgba(180,130,50,${p.opacity})`
                  : `rgba(140,100,30,${p.opacity})`,
                filter: 'blur(1px)',
              }}
              animate={{ x: [0, window.innerWidth + 40] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {/* Sweeping sand wave */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute left-0 right-0"
              style={{
                top: `${20 + i * 20}%`,
                height: 50 + i * 10,
                background: isLight
                  ? `rgba(200,160,60,${0.06 + i * 0.02})`
                  : `rgba(120,80,20,${0.08 + i * 0.02})`,
                filter: 'blur(20px)',
              }}
              animate={{ x: ['0%', '5%', '0%'] }}
              transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i }}
            />
          ))}
        </div>
      )}

      {/* ── SMOKE ── */}
      {condition === 'smoke' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {smokeParticles.map((p) => (
            <motion.div
              key={`smoke-${p.id}`}
              className="absolute rounded-full"
              style={{
                left: p.left,
                bottom: '-100px',
                width: p.size,
                height: p.size,
                background: isLight
                  ? 'rgba(80,80,80,0.12)'
                  : 'rgba(40,40,40,0.4)',
                filter: 'blur(20px)',
              }}
              animate={{
                y: [0, -(600 + Math.random() * 400)],
                x: [0, (Math.random() - 0.5) * 200],
                scale: [0.5, 2.5],
                opacity: [0, 0.6, 0],
              }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? 'rgba(60,60,60,0.12)'
                : 'rgba(10,10,10,0.5)',
            }}
          />
        </div>
      )}

      {/* ── ASH ── */}
      {condition === 'ash' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {snowFlakes.slice(0, 40).map((flake) => (
            <motion.div
              key={`ash-${flake.id}`}
              className="absolute rounded-full"
              style={{
                left: flake.left,
                width: flake.size * 0.7,
                height: flake.size * 0.7,
                top: '-20px',
                background: isLight ? 'rgba(100,100,100,0.5)' : 'rgba(150,150,150,0.35)',
                filter: 'blur(0.5px)',
              }}
              animate={{
                y: ['0vh', '108vh'],
                x: [`0px`, `${flake.wobble / 2}px`, `-${flake.wobble / 3}px`],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: flake.duration * 1.5, delay: flake.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          <div className="absolute inset-0" style={{ background: 'rgba(50,50,50,0.2)' }} />
        </div>
      )}

      {/* ── SQUALL ── */}
      {condition === 'squall' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {heavyRainDrops.slice(0, 100).map((drop) => (
            <motion.div
              key={`squall-${drop.id}`}
              className="absolute rounded-full"
              style={{
                left: drop.left,
                width: 1.5,
                height: 22,
                top: '-35px',
                background: isLight ? 'rgba(80,120,200,0.5)' : 'rgba(140,190,255,0.45)',
              }}
              animate={{ y: ['0vh', '112vh'], x: ['0px', '-80px'] }}
              transition={{ duration: drop.duration * 0.8, delay: drop.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {/* Strong wind streaks */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`wind-${i}`}
              className="absolute"
              style={{
                top: `${15 + i * 18}%`,
                left: '-300px',
                width: 250,
                height: 2,
                background: isLight
                  ? 'linear-gradient(to right, transparent, rgba(100,150,220,0.4), transparent)'
                  : 'linear-gradient(to right, transparent, rgba(150,200,255,0.25), transparent)',
                borderRadius: 2,
              }}
              animate={{ x: [0, window.innerWidth + 400] }}
              transition={{ duration: 1.2 + i * 0.3, delay: i * 0.4, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      )}

      {/* ── TORNADO ── */}
      {condition === 'tornado' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Tornado funnel */}
          <motion.div
            className="absolute"
            style={{
              left: '45%',
              top: '5%',
              width: 80,
              height: '70%',
              background: isLight
                ? 'linear-gradient(to bottom, rgba(80,100,130,0.5) 0%, rgba(50,70,100,0.3) 50%, rgba(30,50,80,0.15) 100%)'
                : 'linear-gradient(to bottom, rgba(30,40,60,0.6) 0%, rgba(20,30,50,0.4) 50%, transparent 100%)',
              filter: 'blur(8px)',
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          {/* Debris particles */}
          {dustParticles.slice(0, 30).map((p) => (
            <motion.div
              key={`debris-${p.id}`}
              className="absolute"
              style={{
                width: p.size,
                height: p.size / 2,
                background: isLight ? 'rgba(50,60,80,0.6)' : 'rgba(30,40,60,0.8)',
                borderRadius: 2,
              }}
              animate={{
                x: [0, Math.cos(p.id) * 200, Math.cos(p.id + 1) * 150, 0],
                y: [0, Math.sin(p.id) * 200 - 100, Math.sin(p.id + 1) * 150 - 200, -500],
                rotate: [0, 720],
                opacity: [0.8, 0.5, 0],
              }}
              transition={{ duration: 3 + Math.random() * 2, delay: p.delay, repeat: Infinity, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}

      {/* ── SHARED: Animated depth blobs (all conditions) ── */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: [380, 300, 260, 220][i],
            height: [380, 300, 260, 220][i],
            top: ['0%', '20%', 'auto', 'auto'][i],
            bottom: [undefined, undefined, '20%', '0%'][i] as string | undefined,
            left: ['0%', 'auto', '20%', 'auto'][i],
            right: [undefined, '0%', undefined, '25%'][i] as string | undefined,
            background: getBlobColor(condition, isLight, i),
            filter: 'blur(80px)',
            mixBlendMode: 'screen',
            opacity: isLight ? 0.18 : 0.22,
          }}
          animate={{
            x: [0, 50 - i * 10, -40 + i * 5, 0],
            y: [0, -70 + i * 10, 40 - i * 5, 0],
            scale: [1, 1.15, 0.88, 1],
          }}
          transition={{
            duration: 9 + i * 3.5,
            delay: i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── Noise texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
          opacity: 0.03,
        }}
      />

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.05) 100%)'
            : 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Helper: blob colors per condition
───────────────────────────────────────────────────────────── */
function getBlobColor(condition: string, isLight: boolean, idx: number): string {
  const palettes: Record<string, string[]> = {
    clear:        ['#4f8ef7', '#a78bfa', '#60a5fa', '#818cf8'],
    clouds:       ['#64748b', '#475569', '#94a3b8', '#334155'],
    rain:         ['#1e40af', '#1d4ed8', '#3b82f6', '#1e3a8a'],
    drizzle:      ['#1e40af', '#2563eb', '#60a5fa', '#1d4ed8'],
    thunderstorm: ['#4c1d95', '#5b21b6', '#7c3aed', '#3730a3'],
    snow:         ['#bfdbfe', '#dbeafe', '#e0f2fe', '#93c5fd'],
    mist:         ['#475569', '#64748b', '#94a3b8', '#334155'],
    fog:          ['#475569', '#64748b', '#94a3b8', '#334155'],
    haze:         ['#92400e', '#b45309', '#d97706', '#78350f'],
    dust:         ['#92400e', '#a16207', '#ca8a04', '#78350f'],
    sand:         ['#92400e', '#a16207', '#ca8a04', '#78350f'],
    ash:          ['#374151', '#4b5563', '#6b7280', '#1f2937'],
    squall:       ['#1e3a8a', '#1e40af', '#2563eb', '#172554'],
    tornado:      ['#1f2937', '#374151', '#4b5563', '#111827'],
    smoke:        ['#1f2937', '#111827', '#374151', '#0f172a'],
  };
  const colors = palettes[condition] || palettes.clear;
  const lightAdjust = isLight ? colors[idx].replace('1e', '60').replace('4c', 'a0') : colors[idx];
  return lightAdjust;
}
