import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, Loader2, FileText } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '@/api/mockData';

const EMPTY_POST = { title: '', category: '', excerpt: '', content: '', image_url: '', published: true };

function PostModal({ post, onClose, onSave }) {
  const [form, setForm] = useState(post || EMPTY_POST);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error('Título e conteúdo são obrigatórios.');
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{post?.id ? 'Editar Artigo' : 'Novo Artigo'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Título *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bronze/50"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Compliance Trabalhista: o que sua empresa precisa saber"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Categoria</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bronze/50"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Ex: Compliance Trabalhista, Direito do Trabalho..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Conteúdo completo *</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bronze/50 resize-none leading-relaxed"
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Escreva aqui o conteúdo completo do seu artigo..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm({ ...form, published: !form.published })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                form.published
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-gray-50 border-gray-300 text-gray-500'
              }`}
            >
              {form.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {form.published ? 'Publicado (visível no site)' : 'Rascunho (oculto)'}
            </button>
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
            Salvar Artigo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'new' | post object

  const { data: posts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
    select: (data) => data?.length > 0 ? data : MOCK_BLOG_POSTS,
  });

  const saveMutation = useMutation({
    mutationFn: async (form) => {
      const { id, created_at, ...cleanForm } = form;
      if (id) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(cleanForm)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(cleanForm)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Artigo salvo!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Artigo removido.');
    },
  });

  const togglePublished = async (post) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({ published: !post.published })
      .eq('id', post.id);
    if (error) {
      toast.error('Erro ao atualizar status.');
      return;
    }
    qc.invalidateQueries({ queryKey: ['blogPosts'] });
  };

  return (
    <AdminLayout>
      <div className="px-8 py-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Artigos do Blog</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os artigos que aparecem na seção de blog do site.</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2b4a] text-white text-sm font-medium rounded-lg hover:bg-[#253965] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Artigo
        </button>
      </div>

      <div className="p-8">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum artigo ainda. Clique em "Novo Artigo" para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.category && (
                      <span className="text-[10px] bg-bronze/10 text-bronze px-2 py-0.5 rounded-full font-medium">
                        {post.category}
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      post.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-semibold text-sm truncate">{post.title}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublished(post)}
                    title={post.published ? 'Ocultar' : 'Publicar'}
                    className="p-2 text-gray-400 hover:text-bronze hover:bg-bronze/10 rounded-lg transition-colors"
                  >
                    {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setModal(post)}
                    className="p-2 text-gray-400 hover:text-bronze hover:bg-bronze/10 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este artigo?')) {
                        deleteMutation.mutate(post.id);
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
        <PostModal
          post={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={(form) => saveMutation.mutateAsync(form)}
        />
      )}
    </AdminLayout>
  );
}