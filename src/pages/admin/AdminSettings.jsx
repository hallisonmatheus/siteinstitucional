import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Shield, Lock, Database, Loader2, Check, Key, Search } from 'lucide-react';
import { SectionCard, EditableText } from '../../components/admin/FieldEditor';
import { useSiteConfig } from '../../lib/useSiteConfig';

export default function AdminSettings() {
  const { user } = useAuth();
  const { config, set } = useSiteConfig();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const isDemo = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error('Digite a nova senha.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setUpdating(true);

    try {
      if (isDemo) {
        // Simulate password change
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Senha atualizada com sucesso no ambiente de demonstração!');
      } else {
        // Real Supabase password update
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        toast.success('Senha atualizada com sucesso!');
      }
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Erro ao atualizar senha: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Get user display details
  const userEmail = user?.email || 'admin@admin.com';
  const userName = user?.user_metadata?.full_name || 'Dr. Hallison Matheus';
  const userRole = user?.role === 'admin' || user?.email?.includes('admin') ? 'Administrador' : 'Usuário';

  return (
    <AdminLayout>
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Configurações Gerais</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie os dados da sua conta administrativa e configurações de segurança.</p>
      </div>

      <div className="p-8 max-w-4xl space-y-8">
        
        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Account Card */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-[#B8A068]/10 text-[#B8A068] flex items-center justify-center font-serif text-lg font-bold">
                {userName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{userName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{userEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  <Shield className="w-3 h-3" /> Nível de Acesso
                </span>
                <p className="text-sm font-semibold text-gray-800">{userRole}</p>
              </div>
              
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  <Database className="w-3 h-3" /> Banco de Dados
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isDemo ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  <span className="text-sm font-semibold text-gray-800">
                    {isDemo ? 'Modo de Demonstração (Local)' : 'Supabase (Produção)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Database Banner */}
          <div className="md:col-span-1 bg-[#1a2b4a] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            {/* Subtle background icon */}
            <Database className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 pointer-events-none" />
            
            <div className="space-y-2 relative">
              <h4 className="font-bold font-serif text-base text-[#B8A068]">Ambiente Jurídico</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Este painel de controle está sincronizado e protegido pelas diretrizes de segurança da informação (LGPD e sigilo profissional).
              </p>
            </div>

            <div className="text-[10px] text-white/40 font-mono mt-6 relative">
              v1.0.0 • Hallison Matheus
            </div>
          </div>

        </div>

        {/* Change Password Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-2xl">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
            <Lock className="w-4 h-4 text-[#B8A068]" />
            <h3 className="font-bold text-gray-900 text-base">Alterar Senha</h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nova Senha</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 bg-gray-50/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirmar Nova Senha</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 bg-gray-50/50"
                    required
                  />
                </div>
              </div>
            </div>

            {isDemo && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200/50 rounded-xl p-3">
                <strong>Nota:</strong> No modo de demonstração local, você pode alterar a senha, mas as credenciais de login continuam aceitando o usuário local <strong>demo@admin.com</strong>.
              </p>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-1.5 px-6 py-3 bg-[#1a2b4a] hover:bg-[#253965] text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

        {/* SEO Configuration */}
        <SectionCard 
          title="Configurações de SEO (Google)" 
          description="Ajuste como o seu site aparece nos resultados de busca do Google e quando é compartilhado nas redes sociais."
          icon={Search}
        >
          <EditableText
            label="Título Principal (Meta Title)"
            value={config.seo_title}
            onSave={(v) => set('seo', 'title', v)}
            hint="Este é o título que aparece na aba do navegador e como título principal no Google. Recomenda-se até 60 caracteres."
          />
          <EditableText
            label="Descrição (Meta Description)"
            value={config.seo_description}
            onSave={(v) => set('seo', 'description', v)}
            multiline
            hint="Um resumo atrativo sobre o seu site que aparece logo abaixo do título nas pesquisas do Google. Recomenda-se entre 150 e 160 caracteres."
          />
          <EditableText
            label="Palavras-chave (Keywords)"
            value={config.seo_keywords}
            onSave={(v) => set('seo', 'keywords', v)}
            multiline
            hint="Palavras ou frases separadas por vírgula que descrevem seu serviço. Ex: advogado, goiânia, trabalhista."
          />
        </SectionCard>

      </div>
    </AdminLayout>
  );
}
