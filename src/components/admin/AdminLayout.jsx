import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard, Image, FileText, HelpCircle, Link as LinkIcon,
  ExternalLink, ChevronRight, User, Calendar, Clock, Settings, LogOut, BookOpen, Menu
} from 'lucide-react';

const mainMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Calendar, label: 'Agendamentos', path: '/admin/appointments' },
  { icon: Clock, label: 'Horários Disponíveis', path: '/admin/availability' },
  { icon: Image, label: 'Galeria/Imagens', path: '/admin/gallery' },
  { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  { icon: BookOpen, label: 'Manual do Sistema', path: '/admin/manual' },
];

const contentMenuItems = [
  { icon: Image, label: 'Hero (Topo)', path: '/admin/hero' },
  { icon: User, label: 'Sobre Mim', path: '/admin/sobre' },
  { icon: LinkIcon, label: 'Links e Contato', path: '/admin/links' },
  { icon: FileText, label: 'Artigos do Blog', path: '/admin/blog' },
  { icon: HelpCircle, label: 'Perguntas Frequentes', path: '/admin/faq' },
];

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair do painel administrativo?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email || 'Administrador';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 min-[900px]:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#1a2b4a] border-r border-[#1a2b4a] flex flex-col fixed top-0 bottom-0 left-0 z-40 shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'max-[900px]:-translate-x-full'} min-[900px]:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-[#253965]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#B8A068] rounded flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">HM</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Painel Admin</p>
              <p className="text-slate-300 text-xs">Hallison Matheus</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Main Links */}
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Principal</p>
            {mainMenuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-[#253965] text-white font-medium shadow-sm'
                      : 'text-slate-200 hover:bg-[#253965]/40 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#B8A068]' : 'text-slate-300'}`} />
                  {item.label}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#B8A068]" />}
                </Link>
              );
            })}
          </div>

          {/* CMS Content Links */}
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Conteúdo do Site</p>
            {contentMenuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
                    active
                      ? 'bg-[#253965] text-white font-medium'
                      : 'text-slate-300 hover:bg-[#253965]/40 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-[#B8A068]' : 'text-slate-400'}`} />
                  {item.label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto text-[#B8A068]" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-[#253965] bg-[#122038]/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#B8A068] text-white font-semibold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate leading-tight">{userName}</p>
              <p className="text-slate-400 text-[9px] truncate">Conectado</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 bg-[#253965]/40 hover:bg-[#253965]/70 hover:text-white transition-all text-center w-full"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver site ao vivo
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-[900px]:ml-64 max-[900px]:ml-0 min-h-screen transition-all duration-300">
        {/* Mobile Header */}
        <div className="min-[900px]:hidden flex items-center p-4 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-gray-800">Painel Admin</span>
        </div>
        {children}
      </main>
    </div>
  );
}