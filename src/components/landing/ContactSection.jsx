import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, Calendar, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function ContactSection({ config = {} }) {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const waLink = config.links_whatsapp || 'https://wa.me/5500000000000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    setSending(true);
    
    try {
      // 1. Save submission to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([form]);
      
      if (error) throw error;

      // 2. Send notification via EmailJS if configured
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey && publicKey !== 'INSIRA_SUA_CHAVE_PUBLICA_AQUI') {
        const cleanPhone = form.whatsapp ? form.whatsapp.replace(/\D/g, '') : '';
        const whatsappLink = cleanPhone ? `https://wa.me/55${cleanPhone}` : '';

        const emailJsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              client_name: form.name,
              client_email: form.email,
              client_whatsapp: form.whatsapp || 'Não informado',
              whatsapp_link: whatsappLink,
              email_subject: form.subject || 'Contato via Site',
              email_message: form.message
            }
          })
        });

        if (!emailJsResponse.ok) {
          const errText = await emailJsResponse.text();
          console.error('EmailJS error:', errText);
        }
      }
      
      toast.success('Mensagem enviada com sucesso!');
      setForm({ name: '', email: '', whatsapp: '', subject: '', message: '' });
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Erro ao enviar mensagem.');
    } finally {
      setSending(false);
    }
  };

  const inputStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none', width: '100%', transition: 'border-color 0.3s', boxSizing: 'border-box' };

  return (
    <section id="contato" style={{ padding: '52px 0', background: '#ffffff' }}>
      <div className="container-legal" ref={ref}>
        <div className="contact-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 60, alignItems: 'stretch' }}>
          {/* Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={inView ? { opacity: 1, x: 0 } : {}}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8966a', marginBottom: 24, fontWeight: 700 }}>Vamos Conversar?</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 300, lineHeight: 1.1, color: '#1a1a1b', marginBottom: 48 }}>
                Agende sua consulta<br />e dê o primeiro passo<br />para a <em style={{ color: '#162d5d' }}>solução.</em>
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 'auto', marginBottom: 20 }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#1a1a1b', textDecoration: 'none', fontSize: 14, transition: 'color 0.3s', fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = '#162d5d'}
                onMouseLeave={e => e.currentTarget.style.color = '#1a1a1b'}
              >
                <div style={{ width: 40, height: 40, border: '1px solid rgba(22,45,93,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: '#162d5d' }}>
                  <MessageCircle size={20} />
                </div>
                Fale no WhatsApp
              </a>
              <a href="#contato"
                style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#1a1a1b', textDecoration: 'none', fontSize: 14, transition: 'color 0.3s', fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = '#162d5d'}
                onMouseLeave={e => e.currentTarget.style.color = '#1a1a1b'}
              >
                <div style={{ width: 40, height: 40, border: '1px solid rgba(22,45,93,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: '#162d5d' }}>
                  <Calendar size={20} />
                </div>
                Agendar consulta
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15 }}>
            <div className="contact-form-card" style={{ background: '#f8f9fa', border: '1px solid rgba(0,0,0,0.05)' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-row-2">
                  <input style={{...inputStyle, background: '#ffffff', color: '#1a1a1b', borderColor: 'rgba(0,0,0,0.1)'}} placeholder="Nome completo *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} onFocus={e => e.target.style.borderColor = '#162d5d'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                  <input style={{...inputStyle, background: '#ffffff', color: '#1a1a1b', borderColor: 'rgba(0,0,0,0.1)'}} placeholder="E-mail *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={e => e.target.style.borderColor = '#162d5d'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                </div>
                <div className="form-row-2" style={{ marginTop: 24 }}>
                  <input style={{...inputStyle, background: '#ffffff', color: '#1a1a1b', borderColor: 'rgba(0,0,0,0.1)'}} placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} onFocus={e => e.target.style.borderColor = '#162d5d'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                  <input style={{...inputStyle, background: '#ffffff', color: '#1a1a1b', borderColor: 'rgba(0,0,0,0.1)'}} placeholder="Assunto" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} onFocus={e => e.target.style.borderColor = '#162d5d'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                </div>
                <textarea style={{ ...inputStyle, background: '#ffffff', color: '#1a1a1b', borderColor: 'rgba(0,0,0,0.1)', minHeight: 120, resize: 'vertical', display: 'block', marginTop: 24 }} placeholder="Como podemos te ajudar? *" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} onFocus={e => e.target.style.borderColor = '#162d5d'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 12, marginBottom: 32 }}>* Autorizo o uso dos meus dados para contato.</p>
                <button type="submit" disabled={sending}
                  style={{ background: sending ? '#64748b' : '#334155', color: '#ffffff', border: 'none', padding: '18px 40px', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.3s', width: '100%', justifyContent: 'center' }}
                  onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#112245'; }}
                  onMouseLeave={e => { if (!sending) e.currentTarget.style.background = '#334155'; }}
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {sending ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .contact-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 100px;
          align-items: stretch;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .contact-form-card {
          padding: 60px;
        }
        @media (max-width: 1024px) {
          .contact-grid-layout { grid-template-columns: 1fr !important; gap: 60px !important; }
        }
        @media (max-width: 768px) {
          .form-row-2 { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (max-width: 640px) {
          .contact-form-card {
            padding: 32px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}