import React from 'react';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

const navLinks = [
  { href: '#inicio', label: 'Início' },
  { href: '#areas', label: 'Áreas de Atuação' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#artigos', label: 'Blog' },
  { href: '#contato', label: 'Contato' },
];

const areaLinks = ['Direito Civil', 'Direito Empresarial', 'Direito Trabalhista', 'Direito Imobiliário', 'Direito de Família e Sucessões'];

export default function Footer({ config = {} }) {
  const slogan = config.rodape_slogan || 'Estratégia jurídica com foco em resultados, segurança e tranquilidade.';
  const instagram = config.links_instagram || 'https://www.instagram.com/hallisonmatheus.adv/';
  const linkedin = config.links_linkedin || 'https://www.linkedin.com/in/hallison-souza-38a056259/';
  const email = config.contato_email || 'contato@hallisonmatheus.adv.br';
  const telefone = config.contato_telefone || '+55 (62) 99999-9999';
  const cidade = config.contato_cidade || 'Goiânia — GO';
  const oab = config.contato_oab || 'OAB/GO';

  const socials = [
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, url: instagram },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, url: linkedin }
  ];

  if (config.links_website) {
    socials.push({
      icon: <Globe size={18} strokeWidth={1.8} />,
      url: config.links_website
    });
  }

  const linkStyle = { fontSize: 14, color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.3s', display: 'block', marginBottom: 12 };

  return (
    <footer style={{ background: '#f8f9fa', padding: '50px 0 20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="footer-container" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="footer-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 60, marginBottom: 80 }}>
          {/* Brand */}
          <div>
            <div className="footer-brand-flex" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, fontWeight: 400, color: '#162d5d', letterSpacing: '0.05em' }}>HM</span>
              <span style={{ width: 1, height: 22, background: '#b8966a', display: 'block' }} />
              <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#162d5d', fontFamily: 'Inter, sans-serif', fontWeight: 600, lineHeight: 1.4 }}>
                Hallison Matheus<br />Advocacia
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 32 }}>{slogan}</p>
            <div className="footer-social-flex" style={{ display: 'flex', gap: 16 }}>
              {socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#162d5d', borderRadius: '50%', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#112245'; e.currentTarget.style.color = '#112245'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#162d5d'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 24, fontWeight: 700 }}>Navegação</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href} style={{ ...linkStyle, color: '#475569' }}
                    onMouseEnter={e => e.target.style.color = '#162d5d'}
                    onMouseLeave={e => e.target.style.color = '#475569'}
                  >{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 24, fontWeight: 700 }}>Áreas</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {areaLinks.map(a => (
                <li key={a}>
                  <a href="#areas" style={{ ...linkStyle, color: '#475569' }}
                    onMouseEnter={e => e.target.style.color = '#162d5d'}
                    onMouseLeave={e => e.target.style.color = '#475569'}
                  >{a}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 24, fontWeight: 700 }}>Contato</h4>
            {[
              { icon: <Phone size={16} />, text: telefone },
              { icon: <Mail size={16} />, text: email },
              { icon: <MapPin size={16} />, text: `${cidade} · ${oab}` },
            ].map((c, i) => (
              <div key={i} className="footer-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#475569', marginBottom: 16 }}>
                <span style={{ color: '#b8966a', flexShrink: 0 }}>{c.icon}</span>
                {c.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom" style={{ paddingTop: 40, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            © 2026 Hallison Matheus Advogado — TODOS OS DIREITOS RESERVADOS
          </p>
          <p style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            DESENVOLVIDO POR <a href="https://carolgonzaga.site/" target="_blank" rel="noopener noreferrer" style={{ color: '#162d5d', textDecoration: 'none', fontWeight: 700, transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#112245'} onMouseLeave={e => e.currentTarget.style.color = '#162d5d'}>CAROLGONZAGA</a>
          </p>
        </div>
      </div>

      <style>{`
        .footer-grid-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 80px;
          margin-bottom: 80px;
        }
        .footer-container {
          padding: 0 64px;
        }
        @media (max-width: 1024px) {
          .footer-grid-layout { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
          .footer-container { padding: 0 32px !important; }
        }
        @media (max-width: 768px) {
          .footer-grid-layout { 
            grid-template-columns: 1fr !important; 
            text-align: center; 
          }
          .footer-brand-flex, .footer-social-flex, .footer-contact-item {
            justify-content: center !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            justify-content: center !important;
            text-align: center !important;
          }
        }
        @media (max-width: 640px) {
          .footer-container { padding: 0 16px !important; }
        }
      `}</style>
    </footer>
  );
}