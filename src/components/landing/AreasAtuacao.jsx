import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const areas = [
  { num: '1', title: 'Direito Civil', desc: 'Contratos, responsabilidade civil, indenizações e soluções jurídicas estratégicas para relações cotidianas.' },
  { num: '2', title: 'Planejamento e Compliance', desc: 'Estruturação empresarial, programas de conformidade, investigação interna, due diligence e gestão de riscos.' },
  { num: '3', title: 'Direito Trabalhista', desc: 'Defesa do empregador e consultoria preventiva, focando na redução de passivos e segurança jurídica. Defesa do empregado, com atendimento personalizado e defesa dos interesses do trabalhador.' },
  { num: '4', title: 'Direito Imobiliário', desc: 'Regularização fundiária, incorporação imobiliária, contratos de compra, venda e locação.' },
  { num: '5', title: 'Família e Sucessões', desc: 'Divórcio, inventário, planejamento sucessório e gestão de patrimônio familiar com sigilo absoluto.' },
];

const positions = [
  { top: '13.3%', left: '-80px', textAlign: 'right', justifyContent: 'flex-end' },
  { top: '13.3%', right: '-80px', textAlign: 'left', justifyContent: 'flex-start' },
  { top: '50%', right: '-120px', transform: 'translateY(-50%)', textAlign: 'left', justifyContent: 'flex-start' },
  { bottom: '-20px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', justifyContent: 'center' },
  { top: '50%', left: '-120px', transform: 'translateY(-50%)', textAlign: 'right', justifyContent: 'flex-end' },
];

function RadialItem({ area, pos, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      style={{ position: 'absolute', width: 280, ...pos, zIndex: 10 }}
    >
      <h3 style={{ fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, justifyContent: pos.justifyContent }}>
        <span style={{ color: '#b8966a', fontWeight: 700 }}>{area.num}</span>
        {area.title}
      </h3>
      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{area.desc}</p>
    </motion.div>
  );
}

export default function AreasAtuacao() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="areas" style={{ padding: '45px 0', background: '#f8f9fa', overflow: 'hidden' }}>
      <div className="container-legal">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: 'center', marginBottom: 16 }}
        >
          <div style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontWeight: 700 }}>
            Áreas de Atuação
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 3.2vw, 46px)', fontWeight: 300, lineHeight: 1.2, color: '#1a1a1b' }}>
            Conheça os 5 pilares da<br /><span style={{ color: '#162d5d' }}>ASSESSORIA JURÍDICA</span>
          </h2>
          <div style={{ width: 60, height: 1, background: '#162d5d', margin: '24px auto 0' }} />
        </motion.div>

        {/* Radial layout - desktop */}
        <div className="radial-desktop" style={{ position: 'relative', width: '100%', maxWidth: 750, height: 500, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Decorative circle */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 320, height: 320, border: '1px solid rgba(22,45,93,0.08)', borderRadius: '50%', pointerEvents: 'none' }}>
            {/* Dots aligned with positions */}
            {[
              { top: '8%', left: '19.5%' }, // Item 1 (Moved down)
              { top: '8%', right: '19.5%' }, // Item 2 (Moved 40px right, 15px down)
              { top: '50%', right: -4, transform: 'translateY(-50%)' }, // Item 3
              { bottom: -4, left: '50%', transform: 'translateX(-50%)' }, // Item 4
              { top: '50%', left: -4, transform: 'translateY(-50%)' }  // Item 5
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 8, height: 8, background: '#b8966a', borderRadius: '50%', opacity: 0.8, zIndex: 2, ...s }} />
            ))}
          </div>

          {/* Center with Rotating Segments (SVG from modelo1/2) */}
          <div className="radial-center" style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.svg 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', inset: -20, width: 'calc(100% + 40px)', height: 'calc(100% + 40px)' }} 
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(22,45,93,0.05)" strokeWidth="4"/>
              <path d="M50 2 A48 48 0 0 1 98 50" fill="none" stroke="#b8966a" strokeWidth="4" strokeDasharray="2 2" opacity="0.4"/>
              <path d="M98 50 A48 48 0 0 1 50 98" fill="none" stroke="#b8966a" strokeWidth="4" strokeDasharray="2 2" opacity="0.4"/>
              <path d="M50 98 A48 48 0 0 1 2 50" fill="none" stroke="#b8966a" strokeWidth="4" strokeDasharray="2 2" opacity="0.4"/>
              <path d="M2 50 A48 48 0 0 1 50 2" fill="none" stroke="#b8966a" strokeWidth="4" strokeDasharray="2 2" opacity="0.4"/>
            </motion.svg>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ width: 180, height: 180, background: '#ffffff', border: '1px solid #162d5d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 48, color: '#162d5d', boxShadow: '0 20px 50px rgba(22,45,93,0.05)', position: 'relative', zIndex: 5 }}
            >
              HM
            </motion.div>
          </div>

          {/* Radial items */}
          {areas.map((area, i) => (
            <RadialItem key={i} area={area} pos={positions[i]} delay={i * 0.15} />
          ))}
        </div>

        {/* Mobile fallback - grid */}
        <div className="radial-mobile" style={{ display: 'none', flexDirection: 'column', gap: 24, maxWidth: 500, margin: '0 auto' }}>
          {areas.map((area, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <h3 style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#b8966a', fontWeight: 700 }}>{area.num}</span>
                {area.title}
              </h3>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{area.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .radial-desktop { display: none !important; }
          .radial-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}