import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to manage mock tables in localStorage
const getMockData = (table) => {
  const data = localStorage.getItem(`hm_mock_${table}`);
  if (data) return JSON.parse(data);

  if (table === 'site_content') {
    const defaults = [
      { id: 'sc-1', section: 'hero', field: 'tag', value: 'Advocacia Estratégica' },
      { id: 'sc-2', section: 'hero', field: 'title_1', value: 'Soluções jurídicas inteligentes para' },
      { id: 'sc-3', section: 'hero', field: 'title_2', value: 'proteger o que realmente importa.' },
      { id: 'sc-4', section: 'hero', field: 'subtitle', value: 'Atuação personalizada e estratégica com foco em resultados reais e práticos para pessoas e empresas em Goiânia e todo o Brasil.' },
      { id: 'sc-5', section: 'hero', field: 'badge', value: 'Atendimento sigiloso e 100% personalizado' },
      { id: 'sc-6', section: 'hero', field: 'image', value: '/portrait0.png' },
      { id: 'sc-7', section: 'sobre', field: 'title', value: 'Comprometimento, estratégia e proximidade em cada caso.' },
      { id: 'sc-8', section: 'sobre', field: 'text1', value: 'Sou Hallison Matheus, advogado com atuação em âmbito nacional, especialmente em Goiânia e Região. Meu trabalho vai muito além de processos: atuo ajudando pessoas e empresas a resolverem problemas com estratégia, segurança jurídica e inteligência — sempre buscando a melhor solução para cada situação.' },
      { id: 'sc-9', section: 'sobre', field: 'quote', value: 'Uma assessoria jurídica moderna não serve apenas para resolver processo quando ele aparece, mas principalmente para trazer segurança, organização, e ajudar empresários e cidadãos a tomarem a melhor decisão, e aquela que oferecerá o menor risco possível.' },
      { id: 'sc-10', section: 'sobre', field: 'text2', value: 'Acredito que ter a orientação jurídica certa faz toda a diferença para evitar prejuízos, proteger direitos e tomar decisões com mais segurança. Por isso, trabalho com prevenção, contratos bem estruturados, compliance e estratégias que visam minimizar os riscos da atividade empresarial, mitigando inclusive riscos e demandas processuais, ou reputacionais.' },
      { id: 'sc-11', section: 'sobre', field: 'image', value: '/portrait2.jpg' },
      { id: 'sc-12', section: 'links', field: 'whatsapp', value: 'https://wa.me/5562999999999' },
      { id: 'sc-13', section: 'links', field: 'instagram', value: 'https://www.instagram.com/hallisonmatheus.adv/' },
      { id: 'sc-14', section: 'links', field: 'linkedin', value: 'https://www.linkedin.com/in/hallison-souza-38a056259/' },
      { id: 'sc-15', section: 'contato', field: 'email', value: 'contato@hallisonmatheus.adv.br' },
      { id: 'sc-16', section: 'contato', field: 'cidade', value: 'Goiânia — GO' },
      { id: 'sc-17', section: 'contato', field: 'oab', value: 'OAB/GO' },
      { id: 'sc-18', section: 'rodape', field: 'slogan', value: 'Estratégia jurídica com foco em resultados, segurança e transparência.' }
    ];
    localStorage.setItem('hm_mock_site_content', JSON.stringify(defaults));
    return defaults;
  }

  if (table === 'appointments') {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const defaults = [
      {
        id: 'appt-1',
        name: 'Maria Oliveira',
        email: 'maria@example.com',
        phone: '(62) 99999-8888',
        message: 'Preciso de orientação sobre um contrato de prestação de serviços empresariais.',
        date: todayStr,
        time: '14:00:00',
        status: 'Pendente',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'appt-2',
        name: 'Carlos Souza',
        email: 'carlos@example.com',
        phone: '(62) 98888-7777',
        message: 'Dúvidas sobre planejamento sucessório e holdings familiares.',
        date: tomorrowStr,
        time: '10:00:00',
        status: 'Confirmado',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    localStorage.setItem('hm_mock_appointments', JSON.stringify(defaults));
    return defaults;
  }

  if (table === 'availability') {
    const defaults = [];
    const standardHours = ['09:00:00', '10:00:00', '11:00:00', '14:00:00', '15:00:00', '16:00:00'];
    // Monday (1) to Friday (5)
    for (let day = 1; day <= 5; day++) {
      standardHours.forEach((hour, idx) => {
        defaults.push({
          id: `avail-${day}-${idx}`,
          weekday: day,
          time: hour,
          active: true,
          date: null
        });
      });
    }
    localStorage.setItem('hm_mock_availability', JSON.stringify(defaults));
    return defaults;
  }

  if (table === 'blocked_dates') {
    const defaults = [];
    localStorage.setItem('hm_mock_blocked_dates', JSON.stringify(defaults));
    return defaults;
  }

  if (table === 'faqs') {
    const defaults = [
      { id: '1', question: 'Preciso de advogado mesmo sem ter processo na justiça?', answer: 'Sim — e esse é exatamente o momento ideal para buscar orientação. A advocacia preventiva é muito mais eficaz e econômica do que aguardar o problema chegar à justiça. Um advogado pode ajudá-lo a revisar contratos, estruturar seu negócio com compliance, evitar passivos trabalhistas e tomar decisões mais seguras antes que qualquer conflito se instale.', order: 1 },
      { id: '2', question: 'O que é Rescisão Indireta e quando posso usar?', answer: 'A Rescisão Indireta é o mecanismo legal que permite ao trabalhador encerrar o contrato de trabalho e receber todos os direitos rescisórios — inclusive a multa de 40% do FGTS e o acesso ao seguro-desemprego — quando a empresa descumpre obrigações contratuais. Isso inclui atrasos reiterados de salário, não recolhimento do FGTS, assédio moral ou exposição a riscos sem proteção adequada.', order: 2 },
      { id: '3', question: 'Como o Compliance Trabalhista protege minha empresa?', answer: 'O Compliance protege através da prevenção. Ele identifica gargalos legais, padroniza processos internos e garante que a empresa siga a legislação à risca, reduzindo drasticamente o risco de multas, autuações e ações trabalhistas.', order: 3 },
      { id: '4', question: 'A consulta inicial é mesmo gratuita? Qual é o próximo passo?', answer: 'A consulta inicial serve para entendermos a viabilidade do seu caso. Clique no botão de WhatsApp para falar com minha equipe e agendar um horário.', order: 4 },
      { id: '5', question: 'Você atende apenas em Goiânia ou também em outras cidades de Goiás?', answer: 'Atendemos em Goiânia, em todo o estado de Goiás e também de forma online para casos específicos em todo o Brasil.', order: 5 },
      { id: '6', question: 'Como é garantido o sigilo das informações do meu caso?', answer: 'O sigilo profissional é um dever ético e legal do advogado. Todas as informações compartilhadas conosco são protegidas pelo segredo profissional e pela LGPD.', order: 6 }
    ];
    localStorage.setItem('hm_mock_faqs', JSON.stringify(defaults));
    return defaults;
  }

  if (table === 'blogs' || table === 'blog_posts') {
    const defaults = [
      {
        id: '1',
        category: 'Compliance Trabalhista',
        title: 'Os pilares do Compliance Trabalhista eficaz',
        excerpt: 'Como uma construção precisa de pilares sólidos, uma empresa deve contar com um programa eficaz de Compliance Trabalhista.',
        content: 'Assim como uma construção precisa de pilares sólidos, uma empresa deve contar com um programa eficaz de Compliance Trabalhista. Trata-se da adesão contínua às leis, normas internas e acordos trabalhistas, promovendo segurança jurídica e um ambiente ético.\n\nMais do que evitar punições, o Compliance fortalece a cultura organizacional e reduz riscos como autuações fiscais, ações trabalhistas e danos à reputação. Já a sua ausência pode comprometer contratos, credibilidade e crescimento.\n\nImplementar Compliance envolve diagnóstico jurídico, código de conduta claro, treinamentos, canal de denúncias e auditorias periódicas. Isso protege a empresa legal e financeiramente, melhora a produtividade e atrai talentos qualificados.\n\nEm resumo, Compliance Trabalhista é um investimento estratégico que promove crescimento sustentável e responsabilidade social.\n\nE você? Gostaria de saber como esse programa pode te ajudar a proteger o seu negócio?',
        created_date: '2026-05-14T10:00:00Z',
        published: true
      },
      {
        id: '2',
        category: 'Gestão de Riscos',
        title: 'Compliance trabalhista não é custo. É proteção.',
        excerpt: 'Empresas estruturadas já entenderam que o verdadeiro diferencial está na prevenção.',
        content: 'Compliance trabalhista não é custo. É proteção.\n\nEnquanto muitos empresários ainda enxergam o jurídico apenas como reação ao problema, empresas estruturadas já entenderam que o verdadeiro diferencial está na prevenção.\n\nReduzir riscos não significa apenas evitar processos. Significa ter segurança nas decisões, previsibilidade financeira e tranquilidade para crescer.\n\nAdequar a empresa à legislação trabalhista não é sobre burocracia. É sobre organização, clareza nas relações e fortalecimento da operação.\n\nE a redução de passivos trabalhistas vai muito além de evitar condenações. É sobre proteger o patrimônio construído com esforço.\n\nA verdade é simples: quem estrutura hoje, economiza amanhã.\n\nSeu negócio está protegido ou apenas funcionando?',
        created_date: '2026-05-14T11:00:00Z',
        published: true
      }
    ];
    localStorage.setItem(`hm_mock_${table}`, JSON.stringify(defaults));
    return defaults;
  }

  return [];
};

const setMockData = (table, data) => {
  localStorage.setItem(`hm_mock_${table}`, JSON.stringify(data));
};

// Builder to handle chainable queries like .from().select().eq().order()
const makeMockQuery = (table, filterFn = null, orderFn = null, limitVal = null) => {
  const executeQuery = () => {
    let data = getMockData(table);
    if (filterFn) {
      data = data.filter(filterFn);
    }
    if (orderFn) {
      data.sort(orderFn);
    }
    if (limitVal !== null) {
      data = data.slice(0, limitVal);
    }
    return data;
  };

  const query = {
    select: (cols) => makeMockQuery(table, filterFn, orderFn, limitVal),
    eq: (col, val) => {
      const newFilter = (item) => {
        const matchesPrev = filterFn ? filterFn(item) : true;
        return matchesPrev && item[col] === val;
      };
      return makeMockQuery(table, newFilter, orderFn, limitVal);
    },
    order: (col, opts = {}) => {
      const asc = opts.ascending !== false;
      const newOrder = (a, b) => {
        if (orderFn) {
          const prevOrder = orderFn(a, b);
          if (prevOrder !== 0) return prevOrder;
        }
        if (a[col] < b[col]) return asc ? -1 : 1;
        if (a[col] > b[col]) return asc ? 1 : -1;
        return 0;
      };
      return makeMockQuery(table, filterFn, newOrder, limitVal);
    },
    limit: (num) => {
      return makeMockQuery(table, filterFn, orderFn, num);
    },
    single: () => {
      const data = executeQuery();
      return Promise.resolve({ data: data[0] || null, error: null });
    },
    // Allows direct await or promise-like behavior
    then: (resolve) => {
      const data = executeQuery();
      return Promise.resolve({ data, error: null }).then(resolve);
    },
    // Modifications
    insert: async (records) => {
      const current = getMockData(table);
      const itemsToInsert = Array.isArray(records) ? records : [records];
      const inserted = itemsToInsert.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        ...item
      }));
      setMockData(table, [...current, ...inserted]);

      const result = {
        data: Array.isArray(records) ? inserted : inserted[0],
        error: null
      };

      return {
        ...result,
        select: () => ({
          single: () => Promise.resolve({ data: result.data, error: null })
        }),
        then: (resolve) => Promise.resolve(result).then(resolve)
      };
    },
    update: async (updates) => {
      const current = getMockData(table);
      let updatedItem = null;
      let matchedCount = 0;

      const next = current.map(item => {
        // Evaluate if item matches the current filters
        const matches = filterFn ? filterFn(item) : true;
        if (matches) {
          matchedCount++;
          const u = { ...item, ...updates };
          updatedItem = u;
          return u;
        }
        return item;
      });

      if (matchedCount > 0) {
        setMockData(table, next);
      }

      const result = {
        data: updatedItem,
        error: null
      };

      // Support .eq() syntax after .update() if the filter wasn't defined before
      return {
        eq: (col, val) => {
          const nextWithEq = current.map(item => {
            if (item[col] === val) {
              const u = { ...item, ...updates };
              updatedItem = u;
              return u;
            }
            return item;
          });
          setMockData(table, nextWithEq);
          const eqResult = { data: updatedItem, error: null };
          return {
            select: () => ({
              single: () => Promise.resolve({ data: updatedItem, error: null })
            }),
            then: (resolve) => Promise.resolve(eqResult).then(resolve)
          };
        },
        select: () => ({
          single: () => Promise.resolve({ data: updatedItem, error: null })
        }),
        then: (resolve) => Promise.resolve(result).then(resolve)
      };
    },
    delete: async () => {
      const current = getMockData(table);
      const next = current.filter(item => {
        const matches = filterFn ? filterFn(item) : true;
        return !matches; // Delete matches (keep non-matches)
      });
      setMockData(table, next);
      
      const result = { error: null };

      return {
        eq: (col, val) => {
          const currentData = getMockData(table);
          const nextData = currentData.filter(item => item[col] !== val);
          setMockData(table, nextData);
          return Promise.resolve({ error: null });
        },
        then: (resolve) => Promise.resolve(result).then(resolve)
      };
    }
  };

  return query;
};

const mockSupabase = {
  from: (table) => makeMockQuery(table),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: () => Promise.resolve(),
  },
  storage: {
    from: (bucket) => ({
      upload: async (path, file) => {
        const currentUploads = JSON.parse(localStorage.getItem('hm_mock_uploads') || '[]');
        const fileName = path.split('/').pop();
        const folder = path.includes('/') ? path.split('/').slice(0, -1).join('/') : '';
        
        // Check if file already exists in mock uploads, if so update it
        const nextUploads = currentUploads.filter(u => u.path !== path);
        nextUploads.push({
          name: fileName,
          folder: folder,
          path: path,
          size: file.size || 1024 * 45,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('hm_mock_uploads', JSON.stringify(nextUploads));
        
        return { data: { path }, error: null };
      },
      getPublicUrl: (path) => {
        let publicUrl = path;
        if (!path.startsWith('/') && !path.startsWith('http')) {
          if (path === 'hero/portrait0.png') publicUrl = '/portrait0.png';
          else if (path === 'about/portrait2.jpg' || path === 'sobre/portrait2.jpg') publicUrl = '/portrait2.jpg';
          else if (path === 'about/portrait0.png') publicUrl = '/portrait0.png';
          else publicUrl = `https://picsum.photos/seed/${encodeURIComponent(path)}/800/600`;
        }
        return { data: { publicUrl } };
      },
      list: async (folder = '', options = {}) => {
        const currentUploads = JSON.parse(localStorage.getItem('hm_mock_uploads') || '[]');
        
        const seedFiles = [
          { name: 'portrait0.png', folder: 'hero', path: 'hero/portrait0.png', size: 102400, created_at: new Date(Date.now() - 3600000 * 240).toISOString() },
          { name: 'portrait2.jpg', folder: 'about', path: 'about/portrait2.jpg', size: 153600, created_at: new Date(Date.now() - 3600000 * 240).toISOString() },
          { name: 'portrait0.png', folder: 'about', path: 'about/portrait0.png', size: 102400, created_at: new Date(Date.now() - 3600000 * 240).toISOString() },
          { name: 'office1.jpg', folder: 'gallery', path: 'gallery/office1.jpg', size: 256000, created_at: new Date(Date.now() - 3600000 * 120).toISOString() },
          { name: 'office2.jpg', folder: 'gallery', path: 'gallery/office2.jpg', size: 300000, created_at: new Date(Date.now() - 3600000 * 120).toISOString() }
        ];
        
        const allFiles = [...seedFiles, ...currentUploads];
        const filtered = allFiles.filter(f => f.folder === folder).map(f => ({
          name: f.name,
          id: f.path,
          created_at: f.created_at,
          metadata: { size: f.size }
        }));
        
        return { data: filtered, error: null };
      },
      remove: async (paths) => {
        const currentUploads = JSON.parse(localStorage.getItem('hm_mock_uploads') || '[]');
        const nextUploads = currentUploads.filter(f => !paths.includes(f.path));
        localStorage.setItem('hm_mock_uploads', JSON.stringify(nextUploads));
        return { data: null, error: null };
      }
    }),
  },
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;

