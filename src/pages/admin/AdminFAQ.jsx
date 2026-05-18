import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Check, Loader2, HelpCircle } from 'lucide-react';
import { MOCK_FAQ } from '@/api/mockData';

const EMPTY_FAQ = { question: '', answer: '', order: 99 };

function FAQModal({ faq, onClose, onSave, nextOrder }) {
  const [form, setForm] = useState(faq || { ...EMPTY_FAQ, order: nextOrder });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.question || !form.answer) {
      toast.error('Pergunta e resposta são obrigatórias.');
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{faq?.id ? 'Editar Pergunta' : 'Nova Pergunta'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Pergunta *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bronze/50"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Ex: Preciso de advogado mesmo sem ter processo na justiça?"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Resposta *</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bronze/50 resize-none leading-relaxed"
              rows={6}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Escreva aqui a resposta completa para a pergunta..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Posição na lista</label>
            <input
              type="number"
              min={1}
              className="w-24 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bronze/50"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
            <p className="text-xs text-gray-400 mt-1">Número menor = aparece antes</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#1a2b4a] text-white text-sm font-medium rounded-lg hover:bg-[#253965] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFAQ() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);

  const { data: faqs = [] } = useQuery({
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
    select: (data) => data?.length > 0 ? data : MOCK_FAQ,
  });

  const saveMutation = useMutation({
    mutationFn: async (form) => {
      const { id, created_at, ...cleanForm } = form;
      if (id) {
        const { data, error } = await supabase
          .from('faqs')
          .update(cleanForm)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('faqs')
          .insert(cleanForm)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('Pergunta salva!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('Pergunta removida.');
    },
  });

  const nextOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.order || 0)) + 1 : 1;

  return (
    <AdminLayout>
      <div className="px-8 py-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Perguntas Frequentes (FAQ)</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie as perguntas e respostas que aparecem no site.</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2b4a] text-white text-sm font-medium rounded-lg hover:bg-[#253965] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Pergunta
        </button>
      </div>

      <div className="p-8">
        {faqs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma pergunta ainda. Clique em "Nova Pergunta" para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 bg-bronze/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-bronze text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-semibold text-sm mb-1">{faq.question}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setModal(faq)}
                    className="p-2 text-gray-400 hover:text-bronze hover:bg-bronze/10 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
                        deleteMutation.mutate(faq.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <FAQModal
          faq={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={(form) => saveMutation.mutateAsync(form)}
          nextOrder={nextOrder}
        />
      )}
    </AdminLayout>
  );
}