import React from 'react';

export default function Hero({ config = {} }) {
  const waLink = config.links_whatsapp || '#';
  const tag = config.hero_tag || 'Advocacia Estratégica';
  const subtitle = config.hero_subtitle || 'Atuação personalizada e estratégica com foco em resultados reais e práticos para pessoas e empresas em Goiânia e todo o Brasil.';
  const badge = config.hero_badge || 'Atendimento sigiloso e 100% personalizado';
  const image = config.hero_image || '/portrait1.png';

  const title1 = config.hero_title_1 || 'Soluções jurídicas inteligentes para';
  let title1_part1 = 'Soluções jurídicas';
  let title1_part2 = 'inteligentes para';
  if (title1 !== 'Soluções jurídicas inteligentes para') {
    const words = title1.split(' ');
    const mid = Math.ceil(words.length / 2);
    title1_part1 = words.slice(0, mid).join(' ');
    title1_part2 = words.slice(mid).join(' ');
  }

  const title2 = config.hero_title_2 || 'proteger o que realmente importa.';
  let title2_part1 = 'proteger o que';
  let title2_part2 = 'realmente importa.';
  if (title2 !== 'proteger o que realmente importa.') {
    const words = title2.split(' ');
    const mid = Math.ceil(words.length / 2);
    title2_part1 = words.slice(0, mid).join(' ');
    title2_part2 = words.slice(mid).join(' ');
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Instrument+Sans:wght@300;400;500&display=swap');

        .hm-hero {
          background: #ECEEF1;
          height: 100vh;
          padding-top: 80px;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr;
          font-family: 'Instrument Sans', sans-serif;
          box-sizing: border-box;
        }

        .hm-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: radial-gradient(circle at 68% 0%, rgba(55,138,221,0.07) 0%, transparent 55%),
                            radial-gradient(circle at 90% 80%, rgba(24,95,165,0.05) 0%, transparent 40%);
        }

        .hm-bg-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hm-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(15,30,60,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,30,60,0.035) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        .hm-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(to bottom, transparent 0%, #185FA5 25%, #185FA5 75%, transparent 100%);
          opacity: 0.55;
        }

        .hm-inner {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 55% 45%;
          height: calc(100vh - 80px);
        }

        .hm-left {
          padding: 36px 48px 64px 64px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid rgba(15,30,60,0.10);
        }

        .hm-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }

        .hm-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 400;
          color: #1A2B4A;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hm-logo-mark {
          width: 36px;
          height: 36px;
          background: #1A2B4A;
          border: 1px solid rgba(26,43,74,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #B8A068;
        }

        .hm-oab-tag {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #7A8FA8;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 300;
        }

        .hm-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 0;
        }

        .hm-eyebrow {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both;
        }

        .hm-eyebrow-line {
          width: 40px;
          height: 1px;
          background: #B8A068;
        }

        .hm-eyebrow-text {
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #B8A068;
          font-weight: 400;
        }

        .hm-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(38px, 4.5vw, 62px);
          line-height: 1.12;
          color: #111828;
          letter-spacing: -0.02em;
          margin-bottom: 0;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both;
        }

        .hm-heading-accent {
          font-style: italic;
          color: #185FA5;
          display: block;
        }

        .hm-heading-normal {
          display: block;
        }

        .hm-divider-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 28px 0;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both;
        }

        .hm-divider-glyph {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: rgba(184,160,104,0.6);
        }

        .hm-divider-dash {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, #D0D8E4, transparent);
        }

        .hm-sub {
          font-size: 13.5px;
          color: #4A5A72;
          line-height: 1.75;
          max-width: 380px;
          font-weight: 300;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both;
          margin-bottom: 36px;
        }

        .hm-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s both;
        }

        .hm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #1A2B4A;
          color: #ffffff;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 500;
          padding: 13px 26px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.3s;
          font-family: 'Instrument Sans', sans-serif;
        }

        .hm-btn-primary:hover { background: #22366A; }

        .hm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: #1A2B4A;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 400;
          padding: 13px 0;
          text-decoration: none;
          border: none;
          border-bottom: 1px solid #B0BCCC;
          cursor: pointer;
          transition: color 0.3s, border-color 0.3s;
          font-family: 'Instrument Sans', sans-serif;
        }

        .hm-btn-ghost:hover { color: #185FA5; border-color: #185FA5; }

        .hm-bottom-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.75s both;
        }

        .hm-trust {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: #7A8FA8;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .hm-trust-dot {
          width: 5px;
          height: 5px;
          background: #B8A068;
          border-radius: 50%;
          opacity: 0.5;
        }

        .hm-scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .hm-scroll-line {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, rgba(26,43,74,0.4), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }

        .hm-right {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #D8DCE3;
        }

        .hm-image-frame {
          position: relative;
          flex: 1;
          overflow: hidden;
        }

        .hm-portrait-wrapper {
          position: absolute;
          top: 12px;
          bottom: 36px;
          left: 24px;
          right: 24px;
        }

        .hm-portrait {
          position: absolute;
          top: 24px;
          left: 24px;
          width: calc(100% - 48px);
          height: calc(100% - 48px);
          object-fit: cover;
          object-position: top center;
          filter: none;
          display: block;
        }

        .hm-image-gradient {
          position: absolute;
          top: 24px;
          left: 24px;
          width: calc(100% - 48px);
          height: calc(100% - 48px);
          background: 
            linear-gradient(to right, rgba(236,238,241,0.4) 0%, transparent 6%),
            linear-gradient(to top, rgba(236,238,241,0.5) 0%, transparent 8%),
            linear-gradient(to bottom, rgba(236,238,241,0.3) 0%, transparent 4%);
          pointer-events: none;
        }

        .hm-corner-mark {
          position: absolute;
          top: 19px;
          right: 19px;
          width: 48px;
          height: 48px;
          border-top: 1px solid rgba(184,160,104,0.4);
          border-right: 1px solid rgba(184,160,104,0.4);
        }

        .hm-corner-mark-bl {
          position: absolute;
          bottom: 19px;
          left: 19px;
          width: 32px;
          height: 32px;
          border-bottom: 1px solid rgba(26,43,74,0.15);
          border-left: 1px solid rgba(26,43,74,0.15);
        }

        .hm-credential-strip {
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
          padding: 28px 36px;
          background: rgba(236,238,241,0.92);
          border-top: 1px solid rgba(26,43,74,0.08);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          z-index: 3;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.8s both;
        }

        .hm-name-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hm-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          color: #111828;
          letter-spacing: 0.05em;
        }

        .hm-title {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #B8A068;
          font-weight: 300;
        }

        .hm-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .hm-badge-label {
          font-size: 8px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #7A8FA8;
          font-weight: 400;
        }

        .hm-badge-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 400;
          color: #4A6080;
          letter-spacing: 0.1em;
        }

        .hm-spec-tags {
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 4;
          animation: fadeIn 1.2s ease 1s both;
        }

        .hm-spec-tag {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2A3D5C;
          padding: 6px 12px;
          border: 1px solid rgba(26,43,74,0.13);
          background: rgba(236,238,241,0.88);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          transition: all 0.3s;
        }

        .hm-spec-tag:hover {
          color: #B8A068;
          background: #1A2B4A;
          border-color: transparent;
        }

        .hm-top-strip {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(15,30,60,0.15) 30%, rgba(15,30,60,0.15) 70%, transparent);
          z-index: 5;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }

        @media (max-width: 1024px) {
          .hm-hero { height: auto !important; min-height: 100vh !important; }
          .hm-inner { grid-template-columns: 1fr !important; min-height: auto !important; }
          .hm-right { height: 500px !important; }
          .hm-left { padding: 40px 48px 60px !important; border-right: none !important; border-bottom: 1px solid rgba(15,30,60,0.10) !important; }
          .hm-portrait-wrapper { top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; }
          .hm-portrait { top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-position: center 15% !important; }
          .hm-image-gradient { top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; }
          .hm-spec-tags { display: none !important; }
          .hm-scroll-hint { display: none !important; }
        }

        @media (max-width: 768px) {
          .hm-right { display: none !important; }
          .hm-left { border-bottom: none !important; padding: 40px 32px 60px !important; }
        }

        @media (max-width: 576px) {
          .hm-top-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            margin-bottom: 32px !important;
          }
          .hm-heading {
            font-size: 38px !important;
            line-height: 1.15 !important;
          }
          .hm-actions {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .hm-btn-primary, .hm-btn-ghost {
            justify-content: center !important;
            text-align: center !important;
          }
          .hm-btn-ghost {
            padding: 12px !important;
            border: 1px solid #B0BCCC !important;
          }
          .hm-bottom-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
            margin-top: 32px !important;
          }
          .hm-right {
            height: 400px !important;
          }
        }
      `}</style>

      <section className="hm-hero" role="banner" aria-label="Hero Hallison Matheus Advocacia">
        <div className="hm-noise"></div>
        <div className="hm-bg-lines">
          <div className="hm-grid-overlay"></div>
          <div className="hm-accent-bar"></div>
          <div className="hm-top-strip"></div>
        </div>

        <div className="hm-inner">
          <div className="hm-left">
            <div className="hm-main-content">
              <div className="hm-eyebrow">
                <span className="hm-eyebrow-text">{tag}</span>
              </div>

              <h1 className="hm-heading">
                <span className="hm-heading-normal">{title1_part1}</span>
                <span className="hm-heading-normal">{title1_part2}</span>
                <span className="hm-heading-accent">{title2_part1}</span>
                <span className="hm-heading-accent">{title2_part2}</span>
              </h1>

              <div className="hm-divider-row">
                <span className="hm-divider-glyph">§</span>
                <div className="hm-divider-dash"></div>
              </div>

              <p className="hm-sub">
                {subtitle}
              </p>

              <div className="hm-actions">
                <a href={waLink} className="hm-btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Falar no Whatsapp
                </a>
                <a href="/agendamento" className="hm-btn-ghost">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Agendar Consulta
                </a>
              </div>
            </div>

            <div className="hm-bottom-row">
              <div className="hm-trust">
                <div className="hm-trust-dot"></div>
                {badge}
              </div>
              <div className="hm-scroll-hint">
                <div className="hm-scroll-line"></div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hm-right">
            <div className="hm-image-frame">
              <div className="hm-portrait-wrapper">
                <img 
                  src={image} 
                  alt="Hallison Matheus — Advogado" 
                  className="hm-portrait" 
                  onError={(e) => { 
                    if (!e.target.src.endsWith('/portrait.jpeg')) {
                      e.target.src = '/portrait.jpeg';
                    } else {
                      e.target.style.background = 'linear-gradient(160deg,#1a1712 0%,#0f0e0b 100%)';
                      e.target.style.objectFit = 'fill';
                    }
                  }} 
                />
                <div className="hm-image-gradient"></div>
                <div className="hm-corner-mark"></div>
                <div className="hm-corner-mark-bl"></div>

                <div className="hm-spec-tags" aria-hidden="true">
                  <span className="hm-spec-tag">Direito Civil</span>
                  <span className="hm-spec-tag">Compliance</span>
                  <span className="hm-spec-tag">Trabalhista</span>
                  <span className="hm-spec-tag">Empresarial</span>
                  <span className="hm-spec-tag">Imobiliário</span>
                </div>

                <div className="hm-credential-strip">
                  <div className="hm-name-block">
                    <span className="hm-name">Hallison Matheus</span>
                    <span className="hm-title">Advogado · OAB · Goiânia</span>
                  </div>
                  <div className="hm-badge">
                    <span className="hm-badge-label">Registrado</span>
                    <span className="hm-badge-value">OAB · GO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}