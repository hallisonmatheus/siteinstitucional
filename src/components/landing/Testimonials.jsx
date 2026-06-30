import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSiteConfig } from '../../lib/useSiteConfig';

export default function Testimonials() {
  const { config } = useSiteConfig();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  // Get active testimonials dynamically
  const activeTestimonials = [];
  for (let i = 1; i <= 3; i++) {
    const active = config[`testimonial_${i}_active`] !== 'false';
    const text = config[`testimonial_${i}_text`]?.trim();
    if (active && text) {
      const name = config[`testimonial_${i}_name`]?.trim() || '';
      const initials = config[`testimonial_${i}_initials`]?.trim() || (name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '');
      const role = config[`testimonial_${i}_role`]?.trim() || '';
      activeTestimonials.push({ initials, name, role, text });
    }
  }

  if (activeTestimonials.length === 0) {
    return null;
  }

  const activeCount = activeTestimonials.length;

  return (
    <section style={{ padding: '45px 0', background: '#f1f5f9', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container-legal">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <div style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontWeight: 700 }}>Depoimentos</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 3.2vw, 46px)', fontWeight: 300, color: '#1a1a1b', lineHeight: 1.1 }}>
            O que dizem<br />meus <em style={{ color: '#162d5d' }}>clientes</em>
          </h2>
        </motion.div>

        <div className="test-grid-layout">
          {activeTestimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              style={{ padding: '44px 40px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', transition: 'all 0.4s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(100,116,139,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 80, lineHeight: 0.6, color: '#b8966a', display: 'block', marginBottom: 28, opacity: 0.3 }}>"</span>
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#1a1a1b', lineHeight: 1.7, marginBottom: 32 }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8f9fa', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#64748b', fontFamily: 'Cormorant Garamond, Georgia, serif', flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1b', marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.05em' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .test-grid-layout {
          display: grid;
          grid-template-columns: repeat(${activeCount}, 1fr);
          gap: 32px;
          max-width: ${activeCount === 2 ? '800px' : activeCount === 1 ? '450px' : '1200px'};
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .test-grid-layout { 
            grid-template-columns: 1fr !important; 
            max-width: 500px !important;
          }
        }
      `}</style>
    </section>
  );
}