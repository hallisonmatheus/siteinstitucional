import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Tag, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MOCK_BLOG_POSTS } from '@/api/mockData';

const PAGE_SIZE = 4;

export default function BlogSection({ config = {} }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileExpandedIdx, setMobileExpandedIdx] = useState(null);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1200);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const waLink = config?.links_whatsapp || 'https://wa.me/5500000000000';

  const { data: remotePosts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const posts = remotePosts.length > 0 ? remotePosts : MOCK_BLOG_POSTS;

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visiblePosts = posts.slice(start, start + PAGE_SIZE);
  const active = posts[activeIdx];

  const handleNav = () => {
    const nextPage = (page + 1) % (totalPages || 1);
    setPage(nextPage);
    setActiveIdx(nextPage * PAGE_SIZE);
  };

  return (
    <section id="artigos" style={{ padding: '45px 0', background: '#f8f9fa', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container-legal" ref={ref}>
        {/* Header */}
        <div className="blog-header-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
            <div style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 20, fontWeight: 700 }}>Artigos & Reflexões</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 3.2vw, 46px)', fontWeight: 300, color: '#1a1a1b', lineHeight: 1.1 }}>
              Inteligência jurídica<br />além do <em style={{ color: '#162d5d' }}>litígio</em>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            style={{ fontSize: 15, color: '#475569', lineHeight: 1.75 }}>
            Textos sobre direito, compliance e estratégia jurídica escritos por Hallison Matheus. Clique em um artigo para ler o conteúdo completo.
          </motion.p>
        </div>

        {posts.length === 0 && (
          <p style={{ color: '#475569', fontSize: 14, textAlign: 'center', padding: '60px 0' }}>Nenhum artigo publicado ainda.</p>
        )}

        {/* Grid */}
        {posts.length > 0 && <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="blog-main-grid"
          style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1px', background: 'rgba(0,0,0,0.05)', height: 650, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}
        >
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
            <div style={{ flex: 1 }}>
              {visiblePosts.map((post, i) => {
                const globalIdx = start + i;
                const isActive = isMobile ? globalIdx === mobileExpandedIdx : globalIdx === activeIdx;
                return (
                  <React.Fragment key={post.id}>
                    <div
                      onClick={() => {
                        if (window.innerWidth <= 1200) {
                          if (mobileExpandedIdx === globalIdx) {
                            setMobileExpandedIdx(null);
                          } else {
                            setMobileExpandedIdx(globalIdx);
                            setTimeout(() => {
                              const activeEl = document.getElementById(`blog-post-${post.id}`);
                              if (activeEl) {
                                const y = activeEl.getBoundingClientRect().top + window.pageYOffset - 100;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                              }
                            }, 50);
                          }
                        } else {
                          setActiveIdx(globalIdx);
                        }
                      }}
                      id={`blog-post-${post.id}`}
                      style={{ padding: '24px 36px', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', background: isActive ? 'rgba(100,116,139,0.05)' : 'transparent', borderLeft: isActive ? '2px solid #b8966a' : '2px solid transparent', transition: 'all 0.3s' }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {post.category && (
                        <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 10, fontWeight: 700 }}>{post.category}</div>
                      )}
                      <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, fontWeight: 400, color: isActive ? '#1a1a1b' : '#475569', lineHeight: 1.35, transition: 'color 0.3s' }}>
                        {post.title}
                      </div>
                    </div>
                    
                    {/* Mobile Content Accordion */}
                    {isMobile && mobileExpandedIdx === globalIdx && (
                      <div className="show-on-mobile hide-on-desktop" style={{ background: '#fcfcfc', padding: '24px 36px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        {post.created_date && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#475569', marginBottom: 20 }}>
                            <Clock size={14} style={{ opacity: 0.6 }} />
                            {new Date(post.created_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        )}
                        <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
                          {post.content.split('\n').filter(Boolean).map((p, i) => (
                            <p key={i} style={{ marginBottom: 14 }}>{p}</p>
                          ))}
                        </div>
                        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 16, fontStyle: 'italic', color: '#1a1a1b', marginBottom: 16 }}>Quer saber como isso se aplica ao seu caso?</p>
                          <a href={waLink}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', background: '#334155', padding: '12px 24px', textDecoration: 'none' }}
                          >
                            Conversar agora
                          </a>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {posts.length > PAGE_SIZE && (
              <button
                onClick={handleNav}
                style={{ height: 60, background: 'rgba(0,0,0,0.02)', borderTop: '1px solid rgba(0,0,0,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155', transition: 'all 0.3s', width: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; e.currentTarget.style.color = '#334155'; }}
              >
                {page === totalPages - 1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            )}
          </div>

          {/* Content */}
          {active && (
            <div className="hide-on-mobile" style={{ background: '#ffffff', padding: '50px 60px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} key={active.id}>
              {active.category && (
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
                  <Tag size={14} />
                  {active.category}
                </div>
              )}
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(18px, 2.2vw, 28px)', fontWeight: 400, lineHeight: 1.2, color: '#1a1a1b', marginBottom: 24 }}>
                {active.title}
              </h2>
              {active.created_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#475569', marginBottom: 32 }}>
                  <Clock size={14} style={{ opacity: 0.6 }} />
                  {new Date(active.created_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
              <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.05)', marginBottom: 40 }} />
              <div style={{ fontSize: 15, color: '#475569', lineHeight: 1.85, flex: 1, overflowY: 'auto', paddingRight: 24, marginBottom: 20 }}>
                {active.content.split('\n').filter(Boolean).map((p, i) => (
                  <p key={i} style={{ marginBottom: 18 }}>{p}</p>
                ))}
              </div>
              <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#1a1a1b' }}>Quer saber como isso se aplica ao seu caso?</p>
                <a href="#"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', background: '#334155', padding: '12px 28px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#112245'}
                  onMouseLeave={e => e.currentTarget.style.background = '#334155'}
                >
                  Conversar agora
                </a>
              </div>
            </div>
          )}
        </motion.div>}
      </div>

      <style>{`
        .blog-header-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: end;
          margin-bottom: 72px;
        }
        @media (max-width: 1200px) {
          .blog-header-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .blog-main-grid { grid-template-columns: 1fr !important; height: auto !important; }
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: block !important; }
        }
        @media (min-width: 1201px) {
          .hide-on-desktop { display: none !important; }
        }
      `}</style>
    </section>
  );
}