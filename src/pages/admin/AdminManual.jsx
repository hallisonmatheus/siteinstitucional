import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  BookOpen, 
  Settings, 
  Link as LinkIcon, 
  ShieldCheck, 
  AlertTriangle,
  Globe,
  ExternalLink,
  Users
} from 'lucide-react';

export default function AdminManual() {
  return (
    <AdminLayout title="Manual do Sistema">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        
        {/* Aviso Importante de Segurança */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg shadow-sm">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-amber-500 w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Aviso Importante: Segurança e Suporte</h3>
              <p className="text-amber-800 mb-4 leading-relaxed">
                As senhas provisórias foram configuradas para facilitar a entrega e o período inicial de suporte técnico. 
                <strong> O suporte técnico de 30 dias se encerra em 27/06/2026.</strong>
              </p>
              <div className="bg-amber-100/50 p-4 rounded-md text-amber-900 text-sm">
                <p className="font-medium mb-1">Ação Necessária até 27/06/2026:</p>
                <p>Altere a senha de <strong>todas</strong> as contas listadas abaixo, bem como a senha de acesso a este Painel de Controle, para garantir a segurança definitiva dos seus dados e infraestrutura.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Visão Geral e Funcionalidades */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 p-6 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">O Site e suas Funcionalidades</h2>
          </div>
          <div className="p-6 text-slate-600 space-y-4 leading-relaxed">
            <p>O site institucional foi desenvolvido com as mais modernas tecnologias web (React, Vite, Tailwind CSS) focando em <strong>alta performance, SEO (otimização para o Google) e design responsivo</strong>, garantindo perfeito funcionamento em computadores, tablets e celulares.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Domínio Principal:</strong> <a href="https://www.hallisonmatheusadvocacia.com.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.hallisonmatheusadvocacia.com.br/</a></li>
              <li><strong>Navegação em Página Única (Single Page):</strong> Transições suaves entre seções como Áreas de Atuação, Sobre, Diferenciais, Blog e Contato.</li>
              <li><strong>Agendamento Integrado:</strong> Sistema de captura de leads e agendamento que envia e-mails automaticamente (via EmailJS) e registra os dados no banco de dados.</li>
              <li><strong>Painel Administrativo:</strong> Permite alteração de textos, fotos, configurações de SEO e gerenciamento de agendamentos em tempo real sem a necessidade de um programador.</li>
            </ul>
          </div>
        </section>

        {/* 2. Como Usar o Painel de Controle */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 p-6 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Como usar o Painel de Controle</h2>
          </div>
          <div className="p-6 text-slate-600 space-y-6 leading-relaxed">
            <p>O Painel de Controle (este ambiente em que você está) é a central de gerenciamento do seu site. Qualquer alteração feita e salva aqui é refletida quase que instantaneamente no site publicado.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-100 rounded-lg p-5">
                <h4 className="font-semibold text-slate-800 mb-2">Páginas de Edição</h4>
                <p className="text-sm">No menu lateral, você encontrará abas como <em>Hero, Sobre, Links, Blog e FAQ</em>. Nessas abas você pode alterar os textos, os links de WhatsApp, frases de efeito e informações de contato do rodapé.</p>
              </div>
              <div className="border border-slate-100 rounded-lg p-5">
                <h4 className="font-semibold text-slate-800 mb-2">Agendamentos</h4>
                <p className="text-sm">A aba <em>Agendamentos</em> lista todas as solicitações enviadas através do formulário do site. Você pode gerenciar, aprovar e marcar como concluídas.</p>
              </div>
              <div className="border border-slate-100 rounded-lg p-5">
                <h4 className="font-semibold text-slate-800 mb-2">Disponibilidade</h4>
                <p className="text-sm">A aba <em>Disponibilidade</em> permite que você defina quais horários de atendimento aparecem disponíveis no formulário de agendamento do site.</p>
              </div>
              <div className="border border-slate-100 rounded-lg p-5">
                <h4 className="font-semibold text-slate-800 mb-2">Configurações (SEO)</h4>
                <p className="text-sm">Configure o título principal do site, a descrição que aparece no Google e as palavras-chave que ajudam seu site a ser encontrado.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border border-slate-100 text-sm">
              <strong>Possível Problema:</strong> Alterei um texto, mas não mudou no site!<br/>
              <strong>Solução:</strong> Às vezes o navegador do visitante guarda uma cópia antiga do site (Cache). Peça ao visitante para pressionar <code>Ctrl + F5</code> ou atualizar a página. Certifique-se também de ter clicado no botão "Salvar" no painel.
            </div>
          </div>
        </section>

        {/* 3. Contas e Infraestrutura */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 p-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Contas, Serviços e Acessos</h2>
          </div>
          <div className="p-6">
            <p className="text-slate-600 mb-6 leading-relaxed">
              Diversos serviços gratuitos e de alta performance foram integrados para compor o seu sistema. Todos foram criados com o seguinte acesso padrão (altere-os no futuro):
            </p>
            
            <div className="bg-slate-800 text-slate-200 rounded-lg p-6 mb-8 font-mono text-sm shadow-inner">
              <div className="mb-2"><span className="text-slate-400">Login / E-mail Padrão:</span> <span className="text-white">hallisonmatheus.adv@gmail.com</span></div>
              <div><span className="text-slate-400">Senha Padrão:</span> <span className="text-white">HallisonProvisorio2026!</span></div>
            </div>

            <div className="space-y-4">
              {/* GitHub */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">GitHub</h4>
                  <p className="text-sm text-slate-500 mt-1">Armazena o código fonte do site (repositório).</p>
                </div>
                <a href="https://github.com/hallisonmatheus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-md font-medium whitespace-nowrap">
                  Acessar <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Vercel */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">Vercel</h4>
                  <p className="text-sm text-slate-500 mt-1">Hospedagem rápida do site e do Painel. Está conectado ao GitHub.</p>
                </div>
                <a href="https://vercel.com/hallison-matheus-projects/siteinstitucional" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-md font-medium whitespace-nowrap">
                  Acessar <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Supabase */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">Supabase</h4>
                  <p className="text-sm text-slate-500 mt-1">Banco de Dados (guarda textos, configurações e agendamentos) e Autenticação.</p>
                </div>
                <a href="https://supabase.com/dashboard/sign-in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-md font-medium whitespace-nowrap">
                  Acessar <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* EmailJS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">EmailJS</h4>
                  <p className="text-sm text-slate-500 mt-1">Serviço que dispara os e-mails automáticos quando alguém preenche o formulário.</p>
                </div>
                <a href="https://dashboard.emailjs.com/sign-in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-md font-medium whitespace-nowrap">
                  Acessar <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Make */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">Make (Automations)</h4>
                  <p className="text-sm text-slate-500 mt-1">Sistema de automações. Usado caso haja disparos de webhook futuros.</p>
                </div>
                <a href="https://www.make.com/en/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-md font-medium whitespace-nowrap">
                  Acessar <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Registro.br */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">Registro.br</h4>
                  <p className="text-sm text-slate-500 mt-1">Gerenciamento do domínio do seu site (.com.br) e renovações anuais.</p>
                </div>
                <a href="https://registro.br/login/?session=required" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-md font-medium whitespace-nowrap">
                  Acessar <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="mt-8 bg-slate-50 p-4 rounded-md border border-slate-100 text-sm text-slate-600">
              <strong className="text-slate-800">Possíveis Problemas com Serviços de Terceiros:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>O site caiu completamente e exibe erro da Vercel:</strong> Verifique se a Vercel está fora do ar ou se houve algum erro no código principal.</li>
                <li><strong>E-mails do formulário não estão chegando:</strong> Entre no <em>EmailJS</em> e veja se a cota gratuita mensal (200 emails) foi atingida.</li>
                <li><strong>O Painel de Controle não carrega dados ou não faz login:</strong> Pode haver instabilidade no <em>Supabase</em>. O banco pode estar em modo de pausa se o projeto ficar mais de 7 dias sem tráfego algum (basta logar no painel do Supabase para reativá-lo, na versão gratuita).</li>
                <li><strong>Domínio não funciona:</strong> Verifique no <em>Registro.br</em> se o pagamento anual está em dia.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Segurança do Painel de Controle */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 p-6 flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Gerenciando seu Login do Painel</h2>
          </div>
          <div className="p-6 text-slate-600 space-y-4 leading-relaxed">
            <p>O acesso a este Painel de Controle é controlado através do <strong>Supabase (Authentication)</strong>. Para alterar o e-mail ou a senha de acesso (que hoje usam as credenciais padrão descritas acima), siga os passos:</p>
            
            <ol className="list-decimal pl-5 space-y-3 font-medium text-slate-700 mt-4">
              <li>Acesse o <a href="https://supabase.com/dashboard/sign-in" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Painel do Supabase</a> com as credenciais padrão.</li>
              <li>Entre no seu projeto (<em>SiteInstitucional</em>).</li>
              <li>No menu lateral esquerdo, clique em <strong>Authentication</strong> e depois em <strong>Users</strong>.</li>
              <li>Lá você verá o e-mail <em>hallisonmatheus.adv@gmail.com</em>.</li>
              <li>Você pode clicar nos "três pontinhos" ao lado do usuário para enviar um e-mail de redefinição de senha (<em>Send password recovery</em>) ou alterar manualmente.</li>
              <li>Também é possível criar novos usuários se desejar dar acesso a funcionários ou equipe de marketing, clicando em <em>Add user</em>.</li>
            </ol>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm mt-6 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p>Mantenha sempre suas credenciais protegidas e em local seguro. Qualquer pessoa com acesso a este painel pode alterar os conteúdos do seu site.</p>
            </div>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}
