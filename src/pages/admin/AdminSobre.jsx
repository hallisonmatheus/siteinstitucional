import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PageHeader, SectionCard, EditableText, ImageEditor } from '../../components/admin/FieldEditor';
import { useSiteConfig } from '../../lib/useSiteConfig';
import { Image } from 'lucide-react';

export default function AdminSobre() {
  const { config, set } = useSiteConfig();

  return (
    <AdminLayout>
      <PageHeader
        title="Seção Sobre Mim"
        subtitle="Edite os textos e a foto da sua apresentação pessoal."
      />
      <div className="p-8 space-y-6">

        <SectionCard
          title="Foto da seção Sobre Mim"
          description="Imagem exibida ao lado do texto de apresentação."
          icon={Image}
        >
          <ImageEditor
            label="Sua foto"
            value={config.sobre_image}
            onSave={(v) => set('sobre', 'image', v)}
            hint="Recomendado: foto profissional em formato paisagem (horizontal). Tamanho mínimo 800x600px."
          />
        </SectionCard>

        <SectionCard title="Textos">
          <EditableText
            label="Título da seção"
            value={config.sobre_title}
            onSave={(v) => set('sobre', 'title', v)}
            hint="Título principal da seção Sobre Mim."
          />
          <EditableText
            label="Texto de apresentação"
            value={config.sobre_text1}
            onSave={(v) => set('sobre', 'text1', v)}
            multiline
            hint="Primeiro parágrafo da sua apresentação."
          />
          <EditableText
            label="Citação em destaque"
            value={config.sobre_quote}
            onSave={(v) => set('sobre', 'quote', v)}
            multiline
            hint="Frase em destaque que aparece entre os parágrafos. Não é necessário colocar aspas."
          />
          <EditableText
            label="Texto complementar"
            value={config.sobre_text2}
            onSave={(v) => set('sobre', 'text2', v)}
            multiline
            hint="Segundo parágrafo, complementa sua apresentação."
          />
        </SectionCard>

      </div>
    </AdminLayout>
  );
}