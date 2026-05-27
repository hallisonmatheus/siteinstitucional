import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PageHeader, SectionCard, EditableText } from '../../components/admin/FieldEditor';
import { useSiteConfig } from '../../lib/useSiteConfig';
import { MessageCircle, Instagram, Mail, Shield } from 'lucide-react';

export default function AdminLinks() {
  const { config, set } = useSiteConfig();

  return (
    <AdminLayout>
      <PageHeader
        title="Links e Informações de Contato"
        subtitle="Atualize seus links de redes sociais, WhatsApp e dados de contato."
      />
      <div className="p-8 space-y-6">

        <SectionCard
          title="WhatsApp"
          description="Link para o WhatsApp que aparece nos botões do site."
          icon={MessageCircle}
        >
          <EditableText
            label="Link do WhatsApp"
            value={config.links_whatsapp}
            onSave={(v) => set('links', 'whatsapp', v)}
            hint="Cole o link completo. Exemplo: https://wa.me/5562999999999 (inclua o DDD e o número sem espaços ou traços)"
          />
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
            💡 <strong>Como descobrir seu link:</strong> Acesse wa.me/seutelefone — substitua "seutelefone" pelo seu número com código do país (55) + DDD + número. Ex: wa.me/5562999999999
          </div>
        </SectionCard>

        <SectionCard
          title="Redes Sociais"
          description="Links para Instagram e LinkedIn."
          icon={Instagram}
        >
          <EditableText
            label="Link do Instagram"
            value={config.links_instagram}
            onSave={(v) => set('links', 'instagram', v)}
            hint="Cole o endereço completo do seu perfil. Ex: https://www.instagram.com/seuperfil/"
          />
          <EditableText
            label="Link do LinkedIn"
            value={config.links_linkedin}
            onSave={(v) => set('links', 'linkedin', v)}
            hint="Cole o endereço completo do seu perfil. Ex: https://www.linkedin.com/in/seuperfil/"
          />
        </SectionCard>

        <SectionCard
          title="Informações de Contato"
          description="Dados exibidos no rodapé e na seção de contato."
          icon={Mail}
        >
          <EditableText
            label="E-mail"
            value={config.contato_email}
            onSave={(v) => set('contato', 'email', v)}
            hint="Seu e-mail profissional para contato."
          />
          <EditableText
            label="Telefone / WhatsApp (Exibição)"
            value={config.contato_telefone}
            onSave={(v) => set('contato', 'telefone', v)}
            hint="O número de telefone formatado para exibição. Ex: +55 (62) 99999-9999"
          />
          <EditableText
            label="Cidade / Estado"
            value={config.contato_cidade}
            onSave={(v) => set('contato', 'cidade', v)}
            hint="Ex: Goiânia — GO"
          />
          <EditableText
            label="Registro OAB"
            value={config.contato_oab}
            onSave={(v) => set('contato', 'oab', v)}
            hint="Ex: OAB/GO 12345"
          />
        </SectionCard>

        <SectionCard
          title="Rodapé"
          description="Textos que aparecem no rodapé do site."
          icon={Shield}
        >
          <EditableText
            label="Slogan do rodapé"
            value={config.rodape_slogan}
            onSave={(v) => set('rodape', 'slogan', v)}
            hint="Frase curta de impacto que aparece abaixo do logo no rodapé."
          />
        </SectionCard>

      </div>
    </AdminLayout>
  );
}