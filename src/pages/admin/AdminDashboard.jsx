import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Image, FileText, HelpCircle, Link as LinkIcon, User, ArrowRight, CheckCircle } from 'lucide-react';

const sections = [
  {
    icon: Image,
    label: 'Hero (Topo do site)',
    desc: 'Altere o título principal, subtítulo, imagem e chamada para ação da primeira tela.',
    path: '/admin/hero',
    color: 'bg-bronze/10 text-bronze',
  },
  {
    icon: User,
    label: 'Sobre Mim',
    desc: 'Edite o texto da sua apresentação pessoal, foto e citação em destaque.',
    path: '/admin/sobre',
    color: 'bg-bronze/10 text-bronze',
  },
  {
    icon: LinkIcon,
    label: 'Links e Contato',
    desc: 'Atualize seu WhatsApp, Instagram, LinkedIn, e-mail e localização.',
    path: '/admin/links',
    color: 'bg-bronze/10 text-bronze',
  },
  {
    icon: FileText,
    label: 'Artigos do Blog',
    desc: 'Adicione, edite ou remova os artigos que aparecem na seção de blog.',
    path: '/admin/blog',
    color: 'bg-bronze/10 text-bronze',
  },
  {
    icon: HelpCircle,
    label: 'Perguntas Frequentes',
    desc: 'Gerencie as perguntas e respostas que aparecem na seção de FAQ.',
    path: '/admin/faq',
    color: 'bg-bronze/10 text-bronze',
  },
];
 
export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Bem-vindo ao Painel!</h1>
        <p className="text-gray-500 text-sm mt-1">Escolha uma seção abaixo para editar o conteúdo do seu site.</p>
      </div>
 
      <div className="p-8">
        {/* Tip card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-800 text-sm font-medium">Como funciona?</p>
            <p className="text-slate-700 text-xs mt-0.5 leading-relaxed">
              Todas as alterações feitas aqui aparecem automaticamente no site ao vivo. Não é necessário nenhum conhecimento técnico, basta clicar, digitar e salvar!
            </p>
          </div>
        </div>
 
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm mb-1">{s.label}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">{s.desc}</p>
              <span className="flex items-center gap-1 text-bronze text-xs font-semibold group-hover:text-bronze-dark group-hover:gap-2 transition-all">
                Editar <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}