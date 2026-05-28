import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Shield, Target, MessageSquare } from 'lucide-react';

const pillars = [
  { icon: Star, title: 'Atendimento Exclusivo', desc: 'Cada cliente é único. Seu caso terá atenção total e estratégia personalizada.' },
  { icon: Shield, title: 'Segurança Jurídica', desc: 'Atuação preventiva e comprometida para garantir tranquilidade e proteção.' },
  { icon: Target, title: 'Foco em Resultados', desc: 'Soluções eficazes e estratégicas, sempre orientadas para o melhor resultado possível.' },
  { icon: MessageSquare, title: 'Comunicação Clara', desc: 'Transparência e empatia em todas as etapas do seu caso.' },
];

export default function Diferenciais() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrent(c => (c + 1) % pillars.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = (current - 1 + pillars.length) % pillars.length;
  const next = (current + 1) % pillars.length;

  return (
    <section id="diferenciais" style={{ padding: '70px 0', background: '#f8f9fa', textAlign: 'center', overflow: 'hidden' }}>
      <div className="container-legal">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontWeight: 700 }}>
            Diferenciais
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 3.2vw, 46px)', fontWeight: 300, lineHeight: 1.2, color: '#1a1a1b', marginBottom: 40 }}>
            Por que escolher minha advocacia?
          </h2>
        </motion.div>

        {/* Carousel */}
        <div style={{ position: 'relative', height: 420, maxWidth: 1000, margin: '0 auto', perspective: 2500 }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {pillars.map((p, i) => {
              let diff = i - current;
              const n = pillars.length;
              if (diff > n / 2) diff -= n;
              if (diff < -n / 2) diff += n;

              const Icon = p.icon;
              const isActive = diff === 0;
              // Circular path calculations
              const angle = diff * (Math.PI / 2.2); // Spacing
              
              // Responsive carousel calculations
              const cardWidth = isMobile ? 'min(320px, 85vw)' : 420;
              const x = isMobile ? diff * 310 : Math.sin(angle) * 420;
              const z = isMobile ? 0 : Math.cos(angle) * 200 - 200;
              const rotateY = isMobile ? 0 : diff * -25;
              const scale = isMobile ? (isActive ? 1 : 0.9) : (isActive ? 1.1 : 0.8);
              const opacity = isMobile ? (isActive ? 1 : 0) : (Math.abs(diff) <= 1.2 ? (isActive ? 1 : 0.4) : 0);
              const pointerEvents = (isMobile && !isActive) ? 'none' : 'auto';

              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    opacity: opacity,
                    x: x,
                    z: z,
                    scale: scale,
                    zIndex: isActive ? 10 : (Math.abs(diff) <= 1.2 ? 5 : 0),
                    rotateY: rotateY,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 24,
                    mass: 1
                  }}
                  style={{
                    position: 'absolute',
                    width: cardWidth,
                    minHeight: 320,
                    padding: isMobile ? '32px 24px' : '40px 32px',
                    background: '#334155',
                    border: '1px solid rgba(184,150,106,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 32,
                    cursor: 'pointer',
                    borderRadius: '4px',
                    boxShadow: isActive ? '0 40px 80px rgba(0,0,0,0.4)' : 'none',
                    backfaceVisibility: 'hidden',
                    pointerEvents: pointerEvents
                  }}
                  onClick={() => setCurrent(i)}
                >
                  <div style={{ width: 64, height: 64, color: '#b8966a' }}>
                    <Icon size={64} strokeWidth={1.2} />
                  </div>
                  <h3 style={{ fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#ffffff', fontWeight: 700, lineHeight: 1.4 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8 }}>{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40 }}>
          {pillars.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid #334155', background: i === current ? '#334155' : 'transparent', cursor: 'pointer', transition: 'all 0.3s', transform: i === current ? 'scale(1.4)' : 'scale(1)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}