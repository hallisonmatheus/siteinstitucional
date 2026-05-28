import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import AreasAtuacao from '../components/landing/AreasAtuacao';
import SobreMim from '../components/landing/SobreMim';
import Diferenciais from '../components/landing/Diferenciais';
import Testimonials from '../components/landing/Testimonials';
import BlogSection from '../components/landing/BlogSection';
import FAQSection from '../components/landing/FAQSection';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';
import { useSiteConfig } from '../lib/useSiteConfig';

export default function Home() {
  const { config } = useSiteConfig();
  const waLink = config.links_whatsapp || 'https://wa.me/5500000000000';

  useEffect(() => {
    if (config.seo_title) {
      document.title = config.seo_title;
      // Also update og:title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', config.seo_title);
    }
    
    if (config.seo_description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', config.seo_description);
      
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', config.seo_description);
    }

    if (config.seo_keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', config.seo_keywords);
    }
  }, [config.seo_title, config.seo_description, config.seo_keywords]);

  return (
    <div style={{ background: '#0a0a0b', minHeight: '100vh', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      <Navbar config={config} />
      <Hero config={config} />
      <AreasAtuacao />
      <SobreMim config={config} />
      <Diferenciais />
      <Testimonials />
      <BlogSection config={config} />
      <ContactSection config={config} />
      <FAQSection />
      <Footer config={config} />

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Falar no WhatsApp"
        style={{ position: 'fixed', bottom: 32, right: 32, background: '#b8966a', color: '#ffffff', width: 60, height: 60, borderRadius: '50%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 800, boxShadow: '0 10px 25px rgba(184,150,106,0.35)', transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1), background 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; e.currentTarget.style.background = '#a38459'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.background = '#b8966a'; }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}