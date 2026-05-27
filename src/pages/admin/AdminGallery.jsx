import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Folder, Image as ImageIcon, Upload, Copy, Check, Trash2, 
  Loader2, Link as LinkIcon
} from 'lucide-react';

const FOLDERS = [
  { value: 'hero', label: 'Hero / Banner' },
  { value: 'about', label: 'Sobre Mim' },
  { value: 'blog', label: 'Blog' },
  { value: 'gallery', label: 'Galeria Geral' }
];

export default function AdminGallery() {
  const qc = useQueryClient();
  const [activeFolder, setActiveFolder] = useState('hero');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // 1. Fetch images in current folder
  const { data: files = [], isLoading } = useQuery({
    queryKey: ['gallery', activeFolder],
    queryFn: async () => {
      // List files from the 'media' bucket inside the active folder
      const { data, error } = await supabase.storage
        .from('media')
        .list(activeFolder);
        
      if (error) throw error;
      
      // Get public URLs for each file
      const filesWithUrls = data.map(file => {
        const path = `${activeFolder}/${file.name}`;
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(path);
          
        return {
          ...file,
          path,
          url: urlData.publicUrl
        };
      });

      return filesWithUrls;
    },
    initialData: [],
  });

  // 2. Upload file mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      // Create clean filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
      const path = `${activeFolder}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery', activeFolder] });
      toast.success('Imagem enviada com sucesso!');
    },
    onError: (err) => {
      toast.error('Erro ao enviar imagem: ' + err.message);
    },
    onSettled: () => {
      setUploading(false);
    }
  });

  // 3. Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: async (path) => {
      const { data, error } = await supabase.storage
        .from('media')
        .remove([path]);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery', activeFolder] });
      toast.success('Imagem excluída.');
    },
    onError: (err) => {
      toast.error('Erro ao excluir imagem: ' + err.message);
    }
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.');
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas arquivos de imagem são permitidos.');
      return;
    }

    setUploading(true);
    uploadMutation.mutate(file);
  };

  const handleCopyUrl = (url, fileId) => {
    navigator.clipboard.writeText(url);
    setCopiedId(fileId);
    toast.success('Link copiado para a área de transferência!');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Galeria de Mídia</h1>
          <p className="text-gray-500 text-sm mt-1">
            Faça upload de fotos e copie seus endereços para usar nos campos do site.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <label className="flex items-center gap-2 px-5 py-3 bg-[#1a2b4a] hover:bg-[#253965] text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>Enviar Imagem</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={uploading} 
            />
          </label>
        </div>
      </div>

      {/* Folders Navigation */}
      <div className="px-8 bg-white border-b border-gray-200">
        <div className="flex gap-6">
          {FOLDERS.map((folder) => (
            <button
              key={folder.value}
              onClick={() => setActiveFolder(folder.value)}
              className={`py-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeFolder === folder.value 
                  ? 'border-[#B8A068] text-[#1a2b4a]' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Folder className="w-4 h-4" />
              {folder.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded-2xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-24 text-center text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="font-bold text-gray-700 text-lg">Pasta Vazia</h3>
            <p className="text-sm mt-1 max-w-sm mx-auto">
              Nenhuma imagem encontrada nesta seção. Faça o primeiro upload usando o botão superior.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => {
              const fileId = file.id || file.name;
              return (
                <div 
                  key={fileId} 
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] bg-gray-50 border-b border-gray-100 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCopyUrl(file.url, fileId)}
                        className="p-2 bg-white hover:bg-[#B8A068] hover:text-white rounded-lg transition-colors text-[#1a2b4a]"
                        title="Copiar Link"
                      >
                        {copiedId === fileId ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir esta imagem da galeria?')) {
                            deleteMutation.mutate(file.path);
                          }
                        }}
                        className="p-2 bg-white hover:bg-rose-600 hover:text-white rounded-lg transition-colors text-rose-600"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span>{formatSize(file.metadata?.size)}</span>
                        <span>•</span>
                        <span>{file.created_at ? new Date(file.created_at).toLocaleDateString('pt-BR') : ''}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => handleCopyUrl(file.url, fileId)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8A068] hover:text-[#1a2b4a] transition-colors"
                      >
                        {copiedId === fileId ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-3.5 h-3.5" />
                            Copiar URL
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
