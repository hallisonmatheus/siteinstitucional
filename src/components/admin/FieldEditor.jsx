import React, { useState, useRef } from 'react';
import { Check, Pencil, X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Inline editable text field
export function EditableText({ label, value, onSave, multiline = false, hint = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
    toast.success('Salvo com sucesso!');
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="group">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}

      {editing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              className="w-full border border-bronze/30 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-bronze/50 resize-none leading-relaxed"
              rows={5}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          ) : (
            <input
              className="w-full border border-bronze/30 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-bronze/50"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2b4a] text-white text-xs font-medium rounded-lg hover:bg-[#253965] transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-transparent hover:border-bronze/30 hover:bg-[#1a2b4a]/5 transition-colors cursor-pointer group"
          onClick={() => { setDraft(value); setEditing(true); }}
        >
          <p className="flex-1 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{value || <span className="text-gray-400 italic">Clique para editar...</span>}</p>
          <Pencil className="w-4 h-4 text-gray-400 group-hover:text-bronze flex-shrink-0 mt-0.5 transition-colors" />
        </div>
      )}
    </div>
  );
}

// Image uploader with preview
export function ImageEditor({ label, value, onSave, hint = '' }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      await onSave(publicUrl);
      toast.success('Imagem atualizada!');
    } catch (error) {
      toast.error('Erro ao enviar imagem: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}

      <div className="space-y-3">
        {value && (
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img src={value} alt="Preview" className="w-full max-h-56 object-cover" />
          </div>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-bronze/30 rounded-lg text-sm text-bronze hover:bg-bronze/5 transition-colors w-full justify-center disabled:opacity-60"
        >
          {uploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Enviando imagem...</>
          ) : (
            <><Upload className="w-4 h-4" /> {value ? 'Trocar imagem' : 'Enviar imagem'}</>
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

// Section card wrapper
export function SectionCard({ title, description, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 bg-bronze/10 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-bronze" />
          </div>
        )}
        <div>
          <h2 className="text-gray-900 font-semibold text-sm">{title}</h2>
          {description && <p className="text-gray-400 text-xs mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
  );
}

// Page header
export function PageHeader({ title, subtitle }) {
  return (
    <div className="px-8 py-6 border-b border-gray-200 bg-white">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}