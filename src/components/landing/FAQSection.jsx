import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MOCK_FAQ } from '@/api/mockData';

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const { data: remoteFaqs = [] } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const faqs = remoteFaqs.length > 0 ? remoteFaqs : MOCK_FAQ;

  const toggle = (id) => setOpen(open === id ? null : id);

  return (
    <section id="faq" style={{ padding: '45px 0', background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container-legal" ref={ref}>
        {/* Header */}
        <div className="faq-header-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
            <div style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 20, fontWeight: 700 }}>Perguntas Frequentes</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 3.2vw, 46px)', fontWeight: 300, color: '#1a1a1b', lineHeight: 1.1 }}>
              Dúvidas sobre<br />seus <em style={{ color: '#162d5d' }}>direitos</em>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            style={{ fontSize: 15, color: '#475569', lineHeight: 1.75 }}>
            Respostas diretas para as questões mais comuns sobre direito trabalhista, compliance e consultoria jurídica em Goiânia. Não encontrou sua dúvida? Entre em contato.
          </motion.p>
        </div>

        {/* FAQ List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
          {faqs.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>Nenhuma pergunta cadastrada ainda.</p>
          ) : (
            faqs.map((faq, i) => {
              const isOpen = open === faq.id;
              return (
                <div key={faq.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)', ...(i === faqs.length - 1 ? { borderBottom: '1px solid rgba(0,0,0,0.05)' } : {}) }}>
                  <div
                    onClick={() => toggle(faq.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 0', cursor: 'pointer', gap: 40 }}
                  >
                    <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 11, color: '#b8966a', letterSpacing: '0.1em', flexShrink: 0, width: 32, fontWeight: 700 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(15px, 1.6vw, 18px)', fontWeight: 400, color: isOpen ? '#b8966a' : '#1a1a1b', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>
                      {faq.question}
                    </span>
                    <div style={{ width: 32, height: 32, background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round">
                        <line x1="7" y1="1" x2="7" y2="13" />
                        <line x1="1" y1="7" x2="13" y2="7" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ overflow: 'hidden', maxHeight: isOpen ? 400 : 0, transition: 'max-height 0.5s cubic-bezier(0.23,1,0.32,1)' }}>
                    <div style={{ padding: '0 0 36px 44px', fontSize: 15, color: '#475569', lineHeight: 1.8, borderLeft: '2px solid rgba(100,116,139,0.1)' }}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      </div>

      <style>{`
        .faq-header-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: end;
          margin-bottom: 72px;
        }
        @media (max-width: 1024px) {
          .faq-header-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 768px) {
          .faq-header-grid { text-align: center !important; }
        }
      `}</style>
    </section>
  );
}