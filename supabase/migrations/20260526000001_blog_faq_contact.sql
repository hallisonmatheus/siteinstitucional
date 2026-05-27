-- Migration: Create Blog Posts, FAQs, and Contact Submissions Tables with RLS Policies

-- 1. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_date TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
CREATE POLICY "Allow public read-only access to blog_posts" 
    ON public.blog_posts 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow full access to blog_posts for authenticated admins" 
    ON public.blog_posts 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- 2. FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    "order" INT DEFAULT 99,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Policies for faqs
CREATE POLICY "Allow public read-only access to faqs" 
    ON public.faqs 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow full access to faqs for authenticated admins" 
    ON public.faqs 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- 3. Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for contact_submissions
CREATE POLICY "Allow public inserts to contact_submissions" 
    ON public.contact_submissions 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow full access to contact_submissions for authenticated admins" 
    ON public.contact_submissions 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- 4. Seed default FAQs if table is empty
INSERT INTO public.faqs (id, question, answer, "order")
VALUES
    ('11111111-1111-1111-1111-faaaaaaaaaaa', 'Preciso de advogado mesmo sem ter processo na justiça?', 'Sim — e esse é exatamente o momento ideal para buscar orientação. A advocacia preventiva é muito mais eficaz e econômica do que aguardar o problema chegar à justiça. Um advogado pode ajudá-lo a revisar contratos, estruturar seu negócio com compliance, evitar passivos trabalhistas e tomar decisões mais seguras antes que qualquer conflito se instale.', 1),
    ('22222222-2222-2222-2222-faaaaaaaaaaa', 'O que é Rescisão Indireta e quando posso usar?', 'A Rescisão Indireta é o mecanismo legal que permite ao trabalhador encerrar o contrato de trabalho e receber todos os direitos rescisórios — inclusive a multa de 40% do FGTS e o acesso ao seguro-desemprego — quando a empresa descumpre obrigações contratuais. Isso inclui atrasos reiterados de salário, não recolhimento do FGTS, assédio moral ou exposição a riscos sem proteção adequada.', 2),
    ('33333333-3333-3333-3333-faaaaaaaaaaa', 'Como o Compliance Trabalhista protege minha empresa?', 'O Compliance protege através da prevenção. Ele identifica gargalos legais, padroniza processos internos e garante que a empresa siga a legislação à risca, reduzindo drasticamente o risco de multas, autuações e ações trabalhistas.', 3),
    ('44444444-4444-4444-4444-faaaaaaaaaaa', 'A consulta inicial é mesmo gratuita? Qual é o próximo passo?', 'A consulta inicial serve para entendermos a viabilidade do seu caso. Clique no botão de WhatsApp para falar com minha equipe e agendar um horário.', 4),
    ('55555555-5555-5555-5555-faaaaaaaaaaa', 'Você atende apenas em Goiânia ou também em outras cidades de Goiás?', 'Atendemos em Goiânia, em todo o estado de Goiás e também de forma online para casos específicos em todo o Brasil.', 5),
    ('66666666-6666-6666-6666-faaaaaaaaaaa', 'Como é garantido o sigilo das informações do meu caso?', 'O sigilo profissional é um dever ético e legal do advogado. Todas as informações compartilhadas conosco são protegidas pelo segredo profissional e pela LGPD.', 6)
ON CONFLICT (id) DO NOTHING;


-- 5. Seed default blog posts if table is empty
INSERT INTO public.blog_posts (id, category, title, excerpt, content, published)
VALUES
    ('11111111-1111-1111-1111-bbbbbbbbbbbb', 'Compliance Trabalhista', 'Os pilares do Compliance Trabalhista eficaz', 'Como uma construção precisa de pilares sólidos, uma empresa deve contar com um programa eficaz de Compliance Trabalhista.', 'Assim como uma construção precisa de pilares sólidos, uma empresa deve contar com um programa eficaz de Compliance Trabalhista. Trata-se da adesão contínua às leis, normas internas e acordos trabalhistas, promovendo segurança jurídica e um ambiente ético.\n\nMais do que evitar punições, o Compliance fortalece a cultura organizacional e reduz riscos como autuações fiscais, ações trabalhistas e danos à reputação. Já a sua ausência pode comprometer contratos, credibilidade e crescimento.\n\nImplementar Compliance envolve diagnóstico jurídico, código de conduta claro, treinamentos, canal de denúncias e auditorias periódicas. Isso protege a empresa legal e financeiramente, melhora a produtividade e atrai talentos qualificados.\n\nEm resumo, Compliance Trabalhista é um investimento estratégico que promove crescimento sustentável e responsabilidade social.\n\nE você? Gostaria de saber como esse programa pode te ajudar a proteger o seu negócio?', TRUE),
    ('22222222-2222-2222-2222-bbbbbbbbbbbb', 'Gestão de Riscos', 'Compliance trabalhista não é custo. É proteção.', 'Empresas estruturadas já entenderam que o verdadeiro diferencial está na prevenção.', 'Compliance trabalhista não é custo. É proteção.\n\nEnquanto muitos empresários ainda enxergam o jurídico apenas como reação ao problema, empresas estruturadas já entenderam que o verdadeiro diferencial está na prevenção.\n\nReduzir riscos não significa apenas evitar processos. Significa ter segurança nas decisões, previsibilidade financeira e tranquilidade para crescer.\n\nAdequar a empresa à legislação trabalhista não é sobre burocracia. É sobre organização, clareza nas relações e fortalecimento da operação.\n\nE a redução de passivos trabalhistas vai muito além de evitar condenações. É sobre proteger o patrimônio construído com esforço.\n\nA verdade é simples: quem estrutura hoje, economiza amanhã.\n\nSeu negócio está protegido ou apenas funcionando?', TRUE),
    ('33333333-3333-3333-3333-bbbbbbbbbbbb', 'Advocacia Estratégica', 'O mito do acordo verbal e a advocacia preventiva', 'Muita gente ainda acredita que só precisa de advogado quando o problema já aconteceu, mas o mercado mudou.', 'Você já ouviu falar no mito do acordo verbal? Muita gente ainda acredita que só precisa de advogado quando o problema já aconteceu, mas o mercado mudou. Hoje, empresas inteligentes trabalham com prevenção jurídica, contratos bem estruturados, compliance e estratégias que evitam conflitos, reduzem prejuízos e protegem o negócio. O jurídico moderno não serve apenas para resolver processos, mas para trazer segurança, organização e ajudar empresários a tomarem decisões mais estratégicas e seguras.\n\nEu sou Hallison Matheus, advogado, e meu trabalho vai muito além de processos. Atuo ajudando pessoas e empresas a resolverem problemas com estratégia, segurança jurídica e inteligência, sempre buscando a melhor solução para cada caso. Porque hoje, ter orientação jurídica certa faz toda diferença para evitar prejuízos, proteger direitos e tomar decisões com mais segurança.', TRUE),
    ('44444444-4444-4444-4444-bbbbbbbbbbbb', 'Direito Empresarial', 'Inteligência jurídica além do litígio', 'O custo de um processo ganho quase nunca compensa a falha na base.', 'Inteligência jurídica além do litígio.\n\nO custo de um processo ganho quase nunca compensa a falha na base.\n\nNo Brasil, muitos tratam o advogado como extintor de incêndio: só lembram quando o fogo já atingiu o estoque. Mas a verdadeira advocacia não é sobre apagar chamas, é sobre construir estruturas que não queimam.\n\nPara o trabalhador, a segurança vem de entender que o direito não é um favor, é a base. Se o contrato é vago, o abuso acontece.\n\nPara o empresário, o lucro que você comemora hoje pode estar sendo drenado por um passivo trabalhista ou uma falha estrutural que você escolheu ignorar ontem.\n\nSegurança jurídica é inteligência estratégica. E compliance, é análise de risco, é entender que a conformidade é o único caminho para a eficiência real.\n\nSeja você, o dono do negócio, ou o profissional, precisa entender: o jogo mudou. Não há mais espaço para o amadorismo ou aventuras, ou você se adequa agora, ou o resultado virá com dor.\n\nComo você tem protegido o seu legado hoje?', TRUE),
    ('55555555-5555-5555-5555-bbbbbbbbbbbb', 'Direito do Trabalho', 'Rescisão Indireta: a terceira via do trabalhador', 'Trabalhar sem receber FGTS não é fase difícil. É falta grave.', 'Trabalhar sem receber FGTS não é ''fase difícil''. É falta grave.\n\nMuitos trabalhadores acreditam que estão encurralados: ou suportam irregularidades em silêncio ou pedem demissão e perdem boa parte das suas verbas rescisórias. Existe uma terceira via que garante a sua dignidade e a sua segurança jurídica: a Rescisão Indireta.\n\nÉ o mecanismo legal para quando a empresa descumpre o contrato. Exemplos comuns:\n1. Atrasos reiterados de salários;\n2. Não recolhimento de FGTS;\n3. Assédio moral ou rigor excessivo;\n4. Exposição a perigos sem a devida proteção.\n\nNa prática, é você quem ''demite'' a empresa por justa causa. O resultado? Você sai recebendo todos os seus direitos, incluindo a multa de 40% do FGTS e o acesso ao seguro-desemprego.\n\nAtenção: a prova é fundamental e o processo exige técnica. O silêncio prolongado pode ser interpretado como perdão tácito.\n\nVocê sabia que é possível sair da empresa mantendo todos os seus direitos sem precisar ser demitido?', TRUE)
ON CONFLICT (id) DO NOTHING;
