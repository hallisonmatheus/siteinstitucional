import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const skills = ['Direito Civil', 'Direito do Consumidor', 'Direito Trabalhista', 'Direito Contratual', 'Previdenciário', 'Consultoria Jurídica'];

export default function SobreMim({ config = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  const title = config.sobre_title || 'Comprometimento, estratégia e proximidade em cada caso.';
  const bio1 = config.sobre_text1 || 'Sou Hallison Matheus, advogado com atuação em âmbito nacional, especialmente em Goiânia e Região. Meu trabalho vai muito além de processos: atuo ajudando pessoas e empresas a resolverem problemas com estratégia, segurança jurídica e inteligência, sempre buscando a melhor solução para cada situação.';
  const bio2 = config.sobre_text2 || 'Acredito que ter a orientação jurídica certa faz toda a diferença para evitar prejuízos, proteger direitos e tomar decisões com mais segurança. Por isso, trabalho com prevenção, contratos bem estruturados, compliance e estratégias que visam minimizar os riscos da atividade empresarial, mitigando inclusive riscos e demandas processuais, ou reputacionais.';
  const quote = config.sobre_quote || 'Uma assessoria jurídica moderna não serve apenas para resolver processo quando ele aparece, mas principalmente para trazer segurança, organização, e ajudar empresários e cidadãos a tomarem a melhor decisão, e aquela que oferecerá o menor risco possível';
  const image = config.sobre_image || '/portrait2.jpg';
  const waLink = config.links_whatsapp || '#';

  const renderTitle = () => {
    if (title.includes(' estratégia')) {
      const parts = title.split(' estratégia');
      return (
        <>
          {parts[0]} <span style={{ color: '#162d5d' }}>estratégia{parts[1]}</span>
        </>
      );
    }
    return title;
  };

  const allSkills = [
    'Direito Civil', 'Direito do Consumidor', 'Direito do Trabalho', 'Direito Contratual',
    'Direito Societário', 'Direito Empresarial', 'Direito Condominial', 'Consultoria Jurídica',
    'Consultoria Preventiva', 'Compliance', 'Due Diligence', 'Chief Compliance Officer (CCO)',
    'LGPD', 'Adequação e Estruturação Empresarial'
  ];

  return (
    <section id="sobre" style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.03)' }} ref={ref}>
      <div className="container-legal">
        <div className="about-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'stretch' }}>
          {/* Left: Image with OAB Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative', height: '100%' }}>
              <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <img
                  src={image}
                  alt="Hallison Matheus"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block', filter: 'grayscale(0.1) contrast(1.05)' }}
                />
              </div>
              <div className="oab-badge" style={{ 
                position: 'absolute', 
                bottom: '-20px', 
                right: '40px', 
                background: '#334155', 
                padding: '20px 32px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                gap: '4px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)', 
                zIndex: 10,
                minWidth: 160
              }}>
                <span style={{ fontSize: 8, letterSpacing: '0.2em', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', lineHeight: 1 }}>Advogado Registrado</span>
                <span style={{ fontSize: 9, letterSpacing: '0.15em', fontWeight: 400, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', lineHeight: 1 }}>na OAB/GO</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <div style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 24, fontweight: 700 }}>Sobre Mim</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 3.2vw, 42px)', fontWeight: 300, lineHeight: 1.1, color: '#1a1a1b', marginBottom: 32 }}>
              {renderTitle()}
            </h2>

            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>{bio1}</p>

            <div style={{ padding: '20px 0 20px 30px', borderLeft: '1px solid #b8966a', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, fontStyle: 'italic', color: '#475569', lineHeight: 1.6, margin: '40px 0' }}>
              "{quote}"
            </div>

            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 40 }}>{bio2}</p>

            <div className="skills-grid-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 40 }}>
              {allSkills.map((skill, i) => (
                <div key={i} style={{ 
                  fontSize: '11px', 
                  color: '#1A2B4A', 
                  border: '1px solid rgba(26,43,74,0.12)', 
                  padding: '6px 14px', 
                  background: 'rgba(236,238,241,0.3)', 
                  borderRadius: '3px',
                  letterSpacing: '0.04em',
                  fontWeight: 500,
                  display: 'inline-block',
                  whiteSpace: 'nowrap'
                }}>
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
 
      <style>{`
        @media (max-width: 1024px) {
          .about-grid-layout { grid-template-columns: 1fr !important; gap: 60px !important; }
          .about-grid-layout > div:first-child { height: 450px; }
          .oab-badge { right: auto !important; left: 50% !important; transform: translateX(-50%) !important; bottom: -20px !important; width: 200px !important; }
        }
      `}</style>
    </section>
  );
}