import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Image, FileText, HelpCircle, Link as LinkIcon,
  ExternalLink, ChevronRight, User, MessageSquare
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Painel', path: '/admin' },
  { icon: Image, label: 'Hero (Topo)', path: '/admin/hero' },
  { icon: User, label: 'Sobre Mim', path: '/admin/sobre' },
  { icon: LinkIcon, label: 'Links e Contato', path: '/admin/links' },
  { icon: FileText, label: 'Artigos do Blog', path: '/admin/blog' },
  { icon: HelpCircle, label: 'Perguntas Frequentes', path: '/admin/faq' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a2b4a] border-r border-[#1a2b4a] flex flex-col fixed top-0 bottom-0 left-0 z-40 shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-[#253965]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-bronze rounded flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">HM</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Painel Admin</p>
              <p className="text-slate-300 text-xs">Hallison Matheus</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[#253965] text-white font-medium'
                    : 'text-slate-200 hover:bg-[#253965]/40 hover:text-white'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-bronze-light' : 'text-slate-300'}`} />
                {item.label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-bronze-light" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#253965]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-[#253965]/40 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver site ao vivo
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}