import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '#areas', label: 'Atuação' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#artigos', label: 'Blog' },
  { href: '#contato', label: 'Contato' },
];

export default function Navbar({ config = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waLink = '#'; // Links disabled as requested

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: scrolled ? '14px 0' : '22px 0',
        background: scrolled ? 'rgba(236,238,241,0.96)' : 'rgba(236,238,241,0)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid rgba(26,43,74,0.06)' : '1px solid rgba(26,43,74,0)',
        transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 64px', width: '100%', maxWidth: '100%' }}>
        {/* Logo matching Hero logo exactly */}
        <a href="#inicio" className="hm-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="hm-logo-mark">HM</div>
          <span style={{ fontSize: 14, fontWeight: 400, color: '#1A2B4A', letterSpacing: '0.18em', fontFamily: 'Cormorant Garamond, serif', textTransform: 'uppercase' }}>
            Hallison Matheus
          </span>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: 36 }} className="hidden-mobile">
          {navLinks.map(l => (
            <a 
              key={l.href} 
              href={l.href} 
              style={{ 
                fontSize: 10.5, 
                letterSpacing: '0.22em', 
                textTransform: 'uppercase', 
                color: '#4A5A72', 
                textDecoration: 'none', 
                fontWeight: 500, 
                transition: 'color 0.3s',
                fontFamily: 'Instrument Sans, sans-serif'
              }}
              onMouseEnter={e => e.target.style.color = '#1A2B4A'}
              onMouseLeave={e => e.target.style.color = '#4A5A72'}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={waLink}
          className="hidden-mobile"
          style={{ 
            fontSize: 10, 
            letterSpacing: '0.22em', 
            textTransform: 'uppercase', 
            color: '#ffffff', 
            background: '#1A2B4A', 
            padding: '11px 24px', 
            textDecoration: 'none', 
            fontWeight: 500, 
            transition: 'background 0.3s',
            fontFamily: 'Instrument Sans, sans-serif'
          }}
          onMouseEnter={e => e.target.style.background = '#22366A'}
          onMouseLeave={e => e.target.style.background = '#1A2B4A'}
        >
          Agendar Consulta
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="show-mobile"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 24, height: 1.5, background: '#1A2B4A', transition: 'all 0.3s' }} />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', background: 'rgba(236,238,241,0.98)', marginTop: 14, borderBottom: '1px solid rgba(26,43,74,0.06)' }}
          >
            <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {navLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4A5A72', textDecoration: 'none', fontFamily: 'Instrument Sans, sans-serif' }}>
                  {l.label}
                </a>
              ))}
              <a href={waLink} onClick={() => setMobileOpen(false)}
                style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ffffff', background: '#1A2B4A', padding: '12px 24px', textDecoration: 'none', fontWeight: 500, textAlign: 'center', marginTop: 8, fontFamily: 'Instrument Sans, sans-serif' }}>
                Agendar Consulta
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hm-logo-mark {
          width: 34px;
          height: 34px;
          background: #1A2B4A;
          border: 1px solid rgba(26,43,74,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #B8A068;
          font-family: 'Cormorant Garamond', serif;
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex; }
        }
      `}</style>
    </header>
  );
}