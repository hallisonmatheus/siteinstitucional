import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Defaults for the whole site
export const DEFAULTS = {
  hero_tag: 'Advocacia Estratégica',
  hero_title_1: 'Soluções jurídicas inteligentes para',
  hero_title_2: 'proteger o que realmente importa.',
  hero_subtitle: 'Atuação personalizada e estratégica com foco em resultados reais e práticos para pessoas e empresas em Goiânia e todo o Brasil.',
  hero_badge: 'Atendimento sigiloso e 100% personalizado',
  hero_image: '/portrait0.png',
  hero_whatsapp: 'https://wa.me/5500000000000',

  sobre_title: 'Comprometimento, estratégia e proximidade em cada caso.',
  sobre_text1: 'Sou Hallison Matheus, advogado com atuação em âmbito nacional, especialmente em Goiânia e Região. Meu trabalho vai muito além de processos: atuo ajudando pessoas e empresas a resolverem problemas com estratégia, segurança jurídica e inteligência — sempre buscando a melhor solução para cada situação.',
  sobre_quote: 'Uma assessoria jurídica moderna não serve apenas para resolver processo quando ele aparece, mas principalmente para trazer segurança, organização, e ajudar empresários e cidadãos a tomarem a melhor decisão, e aquela que oferecerá o menor risco possível',
  sobre_text2: 'Acredito que ter a orientação jurídica certa faz toda a diferença para evitar prejuízos, proteger direitos e tomar decisões com mais segurança. Por isso, trabalho com prevenção, contratos bem estruturados, compliance e estratégias que visam minimizar os riscos da atividade empresarial, mitigando inclusive riscos e demandas processuais, ou reputacionais.',
  sobre_image: '/portrait2.jpg',

  links_whatsapp: 'https://wa.me/5500000000000',
  links_instagram: 'https://www.instagram.com/hallisonmatheus.adv/',
  links_linkedin: 'https://www.linkedin.com/in/hallison-souza-38a056259/',

  contato_email: 'contato@hallisonmatheus.adv.br',
  contato_telefone: '+55 (62) 99999-9999',
  contato_cidade: 'Goiânia — GO',
  contato_oab: 'OAB/GO',

  rodape_slogan: 'Estratégia jurídica com foco em resultados, segurança e transparência.',
};

export function useSiteConfig() {
  const qc = useQueryClient();

  const { data: rawConfigs = [], isLoading } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  // Build a flat key->value map (section_field -> value)
  const config = { ...DEFAULTS };
  rawConfigs.forEach((c) => {
    config[`${c.section}_${c.field}`] = c.value;
  });

  const updateMutation = useMutation({
    mutationFn: async ({ section, key, value }) => {
      // Find existing entry
      const existing = rawConfigs.find((c) => c.section === section && c.field === key);
      
      if (existing) {
        const { data, error } = await supabase
          .from('site_content')
          .update({ value })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('site_content')
          .insert({ section, field: key, value })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['siteConfig'] }),
  });

  const get = (section, key) => config[`${section}_${key}`] ?? '';

  const set = (section, key, value) => updateMutation.mutateAsync({ section, key, value });

  return { config, get, set, isLoading, rawConfigs };
}