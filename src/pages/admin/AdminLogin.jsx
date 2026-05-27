import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const { signIn, isAuthenticated, isLoadingAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Login efetuado com sucesso!');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Erro ao efetuar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#E8EAED] z-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1a2b4a] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8EAED] px-4 py-12 relative" style={{ backgroundImage: "url('/hero_background.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40 z-0"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 p-8 shadow-2xl relative z-10 transition-all">
        {/* Brand/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#1A2B4A] border border-[#1a2b4a]/10 flex items-center justify-center font-semibold text-lg text-[#B8A068] font-serif shadow-md mb-3">
            HM
          </div>
          <h2 className="text-[#1A2B4A] font-serif text-lg tracking-widest text-center uppercase font-medium">
            Hallison Matheus
          </h2>
          <p className="text-[#B8A068] text-[9px] tracking-[0.25em] font-semibold text-center uppercase mt-1">
            Painel Administrativo
          </p>
        </div>

        {isDemoMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-6 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-[11px] font-semibold uppercase tracking-wider">Modo de Teste Ativo</p>
              <p className="text-amber-700 text-xs mt-0.5 leading-normal">
                Conexão Supabase ausente. Use o e-mail <strong className="underline">demo@admin.com</strong> e qualquer senha para testar localmente.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              E-mail corporativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@dominio.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 focus:border-[#B8A068] transition-all bg-white/70"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              Senha de acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 focus:border-[#B8A068] transition-all bg-white/70"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A2B4A] hover:bg-[#B8A068] text-white hover:text-white font-medium text-xs uppercase tracking-widest py-3.5 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 mt-8 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#B8A068]" />
            ) : (
              'Acessar Painel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
