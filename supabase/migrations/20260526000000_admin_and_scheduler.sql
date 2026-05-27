-- Migration: Create Admin and Scheduler Tables with RLS Policies

-- 1. Site Content Table
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section VARCHAR(50) NOT NULL,
    field VARCHAR(50) NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text',
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_section_field UNIQUE (section, field)
);

-- Enable RLS for site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policies for site_content
CREATE POLICY "Allow public read-only access to site_content" 
    ON public.site_content 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow full access to site_content for authenticated admins" 
    ON public.site_content 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- 2. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Confirmado', 'Concluído', 'Cancelado')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policies for appointments
CREATE POLICY "Allow anyone to create an appointment" 
    ON public.appointments 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow full access to appointments for authenticated admins" 
    ON public.appointments 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- 3. Availability Table
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE DEFAULT NULL,
    weekday INT CHECK (weekday BETWEEN 0 AND 6),
    time TIME NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_date_weekday_time UNIQUE (date, weekday, time)
);

-- Enable RLS for availability
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Policies for availability
CREATE POLICY "Allow public read-only access to availability" 
    ON public.availability 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow full access to availability for authenticated admins" 
    ON public.availability 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- 4. Blocked Dates Table
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for blocked_dates
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Policies for blocked_dates
CREATE POLICY "Allow public read-only access to blocked_dates" 
    ON public.blocked_dates 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow full access to blocked_dates for authenticated admins" 
    ON public.blocked_dates 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- 5. Seed default site content values if table is empty
INSERT INTO public.site_content (section, field, value, type)
VALUES
    ('hero', 'tag', 'Advocacia Estratégica', 'text'),
    ('hero', 'title_1', 'Soluções jurídicas inteligentes para', 'text'),
    ('hero', 'title_2', 'proteger o que realmente importa.', 'text'),
    ('hero', 'subtitle', 'Atuação personalizada e estratégica com foco em resultados reais e práticos para pessoas e empresas em Goiânia e todo o Brasil.', 'text'),
    ('hero', 'badge', 'Atendimento sigiloso e 100% personalizado', 'text'),
    ('hero', 'image', '/portrait0.png', 'text'),
    ('sobre', 'title', 'Comprometimento, estratégia e proximidade em cada caso.', 'text'),
    ('sobre', 'text1', 'Sou Hallison Matheus, advogado com atuação em âmbito nacional, especialmente em Goiânia e Região. Meu trabalho vai muito além de processos: atuo ajudando pessoas e empresas a resolverem problemas com estratégia, segurança jurídica e inteligência — sempre buscando a melhor solução para cada situação.', 'text'),
    ('sobre', 'quote', 'Uma assessoria jurídica moderna não serve apenas para resolver processo quando ele aparece, mas principalmente para trazer segurança, organização, e ajudar empresários e cidadãos a tomarem a melhor decisão, e aquela que oferecerá o menor risco possível', 'text'),
    ('sobre', 'text2', 'Acredito que ter a orientação jurídica certa faz toda a diferença para evitar prejuízos, proteger direitos e tomar decisões com mais segurança. Por isso, trabalho com prevenção, contratos bem estruturados, compliance e estratégias que visam minimizar os riscos da atividade empresarial, mitigando inclusive riscos e demandas processuais, ou reputacionais.', 'text'),
    ('sobre', 'image', '/portrait2.jpg', 'text'),
    ('links', 'whatsapp', 'https://wa.me/5500000000000', 'text'),
    ('links', 'instagram', 'https://www.instagram.com/hallisonmatheus.adv/', 'text'),
    ('links', 'linkedin', 'https://www.linkedin.com/in/hallison-souza-38a056259/', 'text'),
    ('contato', 'email', 'contato@hallisonmatheus.adv.br', 'text'),
    ('contato', 'cidade', 'Goiânia — GO', 'text'),
    ('contato', 'oab', 'OAB/GO', 'text'),
    ('rodape', 'slogan', 'Estratégia jurídica com foco em resultados, segurança e transparência.', 'text')
ON CONFLICT (section, field) DO NOTHING;


-- Seed default availability (Monday to Friday, standard slots)
INSERT INTO public.availability (weekday, time, active)
VALUES
    (1, '09:00:00', TRUE), (1, '10:00:00', TRUE), (1, '11:00:00', TRUE),
    (1, '14:00:00', TRUE), (1, '15:00:00', TRUE), (1, '16:00:00', TRUE),
    (2, '09:00:00', TRUE), (2, '10:00:00', TRUE), (2, '11:00:00', TRUE),
    (2, '14:00:00', TRUE), (2, '15:00:00', TRUE), (2, '16:00:00', TRUE),
    (3, '09:00:00', TRUE), (3, '10:00:00', TRUE), (3, '11:00:00', TRUE),
    (3, '14:00:00', TRUE), (3, '15:00:00', TRUE), (3, '16:00:00', TRUE),
    (4, '09:00:00', TRUE), (4, '10:00:00', TRUE), (4, '11:00:00', TRUE),
    (4, '14:00:00', TRUE), (4, '15:00:00', TRUE), (4, '16:00:00', TRUE),
    (5, '09:00:00', TRUE), (5, '10:00:00', TRUE), (5, '11:00:00', TRUE),
    (5, '14:00:00', TRUE), (5, '15:00:00', TRUE), (5, '16:00:00', TRUE)
ON CONFLICT (date, weekday, time) DO NOTHING;
