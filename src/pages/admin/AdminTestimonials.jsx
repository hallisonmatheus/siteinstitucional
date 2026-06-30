import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PageHeader, SectionCard, EditableText } from '../../components/admin/FieldEditor';
import { useSiteConfig } from '../../lib/useSiteConfig';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTestimonials() {
  const { config, set } = useSiteConfig();

  const handleToggleActive = async (index, currentValue) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    try {
      await set(`testimonial_${index}`, 'active', newValue);
      toast.success(`Depoimento ${index} ${newValue === 'true' ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (err) {
      toast.error('Erro ao atualizar status: ' + err.message);
    }
  };

  const renderTestimonialEditor = (index) => {
    const isActive = config[`testimonial_${index}_active`] !== 'false';
    const initials = config[`testimonial_${index}_initials`] || '';
    const name = config[`testimonial_${index}_name`] || '';
    const role = config[`testimonial_${index}_role`] || '';
    const text = config[`testimonial_${index}_text`] || '';

    return (
      <SectionCard
        key={index}
        title={`Depoimento ${index}`}
        description={`Gerencie os dados e o status do depoimento ${index}.`}
        icon={MessageSquare}
      >
        <div className="space-y-6">
          {/* Status Switch */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Status do Depoimento</span>
              <span className="text-xs text-gray-400">
                {isActive ? 'Ativo - Exibido na página inicial' : 'Inativo - Oculto (vago)'}
              </span>
            </div>
            <button
              onClick={() => handleToggleActive(index, isActive ? 'true' : 'false')}
              className={`w-12 h-6.5 rounded-full transition-colors duration-200 focus:outline-none flex items-center p-0.5 ${
                isActive ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'
              }`}
              style={{ width: '48px', height: '26px' }}
            >
              <div className="w-5.5 h-5.5 rounded-full bg-white shadow-md" style={{ width: '22px', height: '22px' }} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EditableText
              label="Iniciais"
              value={initials}
              onSave={(v) => set(`testimonial_${index}`, 'initials', v)}
              hint="Ex: CM"
            />
            <div className="md:col-span-2">
              <EditableText
                label="Nome do Cliente"
                value={name}
                onSave={(v) => set(`testimonial_${index}`, 'name', v)}
                hint="Ex: Carla Mendes"
              />
            </div>
          </div>

          <EditableText
            label="Subtítulo / Causa / Cargo"
            value={role}
            onSave={(v) => set(`testimonial_${index}`, 'role', v)}
            hint="Ex: Direito Trabalhista · Goiânia"
          />

          <EditableText
            label="Texto do Depoimento"
            value={text}
            onSave={(v) => set(`testimonial_${index}`, 'text', v)}
            multiline
            hint="Mensagem compartilhada pelo cliente sobre o seu trabalho."
          />
        </div>
      </SectionCard>
    );
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Depoimentos de Clientes"
        subtitle="Gerencie os depoimentos exibidos no site. Você pode ativar até 3 depoimentos simultâneos."
      />
      <div className="p-8 space-y-8 max-w-4xl">
        {renderTestimonialEditor(1)}
        {renderTestimonialEditor(2)}
        {renderTestimonialEditor(3)}
      </div>
    </AdminLayout>
  );
}
