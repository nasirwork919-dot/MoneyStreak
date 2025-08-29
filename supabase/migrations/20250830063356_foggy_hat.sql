-- BigMoney Complete Database Schema for Supabase
-- Paste this entire script into your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.charity_partners CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.daily_revenue CASCADE;
DROP TABLE IF EXISTS public.draws CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing sequences
DROP SEQUENCE IF EXISTS entry_number_seq CASCADE;
DROP SEQUENCE IF EXISTS referral_code_seq CASCADE;

-- Drop existing views
DROP VIEW IF EXISTS public.user_analytics CASCADE;
DROP VIEW IF EXISTS public.revenue_summary CASCADE;
DROP VIEW IF EXISTS public.referral_performance CASCADE;

-- Create sequences for auto-generation
CREATE SEQUENCE entry_number_seq START 1;
CREATE SEQUENCE referral_code_seq START 1;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    referral_code TEXT UNIQUE,
    total_spent DECIMAL(10,2) DEFAULT 0,
    total_tickets INTEGER DEFAULT 0,
    referral_earnings DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets table
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entry_number TEXT UNIQUE NOT NULL,
    ticket_type TEXT NOT NULL CHECK (ticket_type IN ('paid_3', 'paid_5', 'free_quiz', 'free_referral')),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    draw_type TEXT NOT NULL CHECK (draw_type IN ('700', '1000')),
    draw_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'drawn', 'won', 'expired')),
    payment_id TEXT,
    referral_code TEXT,
    verification_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
    reward_ticket_id UUID REFERENCES public.tickets(id),
    commission_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(referrer_id, referee_id)
);

-- Draws table
CREATE TABLE public.draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_type TEXT NOT NULL CHECK (draw_type IN ('700', '1000')),
    draw_date DATE NOT NULL,
    winner_id UUID REFERENCES public.users(id),
    winning_ticket_id UUID REFERENCES public.tickets(id),
    total_entries INTEGER NOT NULL DEFAULT 0,
    participants_hash TEXT,
    random_seed TEXT,
    result_hash TEXT,
    verification_video_url TEXT,
    participants_csv_url TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'paid')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(draw_type, draw_date)
);

-- Daily revenue aggregation table
CREATE TABLE public.daily_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    ticket_3_count INTEGER NOT NULL DEFAULT 0,
    ticket_5_count INTEGER NOT NULL DEFAULT 0,
    free_quiz_count INTEGER NOT NULL DEFAULT 0,
    free_referral_count INTEGER NOT NULL DEFAULT 0,
    ticket_3_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    ticket_5_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    new_users INTEGER NOT NULL DEFAULT 0,
    referral_conversions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz attempts table
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    questions_answered INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_taken INTEGER, -- seconds
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    ticket_awarded UUID REFERENCES public.tickets(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, DATE(created_at))
);

-- Admin users table
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    permissions TEXT[] DEFAULT ARRAY['read', 'write'],
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Charity partners table
CREATE TABLE public.charity_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    focus_area TEXT NOT NULL,
    partnership_start DATE NOT NULL,
    total_donated DECIMAL(10,2) DEFAULT 0,
    impact_description TEXT,
    programs TEXT[],
    contact_email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions table for tracking
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_start TIMESTAMPTZ DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    pages_visited TEXT[],
    actions_taken TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_draw_date ON public.tickets(draw_date);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX idx_tickets_type ON public.tickets(ticket_type);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referee_id ON public.referrals(referee_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_draws_draw_date ON public.draws(draw_date);
CREATE INDEX idx_draws_status ON public.draws(status);
CREATE INDEX idx_daily_revenue_date ON public.daily_revenue(date);
CREATE INDEX idx_quiz_attempts_user_date ON public.quiz_attempts(user_id, DATE(created_at));
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Functions for automatic field generation
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'BM-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NEXTVAL('referral_code_seq')::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_entry_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'BM-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('entry_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate referral codes
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code = generate_referral_code();
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM public.users WHERE referral_code = NEW.referral_code) LOOP
            NEW.referral_code = generate_referral_code();
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate entry numbers
CREATE OR REPLACE FUNCTION auto_generate_entry_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.entry_number IS NULL THEN
        NEW.entry_number = generate_entry_number();
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM public.tickets WHERE entry_number = NEW.entry_number) LOOP
            NEW.entry_number = generate_entry_number();
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update user stats when tickets are created
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users 
    SET 
        total_spent = total_spent + NEW.amount,
        total_tickets = total_tickets + 1,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update daily revenue
CREATE OR REPLACE FUNCTION update_daily_revenue()
RETURNS TRIGGER AS $$
DECLARE
    ticket_date DATE;
    revenue_amount DECIMAL(10,2);
BEGIN
    ticket_date = DATE(NEW.created_at);
    revenue_amount = NEW.amount;
    
    INSERT INTO public.daily_revenue (
        date, 
        ticket_3_count, 
        ticket_5_count, 
        free_quiz_count,
        free_referral_count,
        ticket_3_revenue, 
        ticket_5_revenue, 
        total_revenue
    )
    VALUES (
        ticket_date,
        CASE WHEN NEW.ticket_type = 'paid_3' THEN 1 ELSE 0 END,
        CASE WHEN NEW.ticket_type = 'paid_5' THEN 1 ELSE 0 END,
        CASE WHEN NEW.ticket_type = 'free_quiz' THEN 1 ELSE 0 END,
        CASE WHEN NEW.ticket_type = 'free_referral' THEN 1 ELSE 0 END,
        CASE WHEN NEW.ticket_type = 'paid_3' THEN revenue_amount ELSE 0 END,
        CASE WHEN NEW.ticket_type = 'paid_5' THEN revenue_amount ELSE 0 END,
        revenue_amount
    )
    ON CONFLICT (date) DO UPDATE SET
        ticket_3_count = daily_revenue.ticket_3_count + CASE WHEN NEW.ticket_type = 'paid_3' THEN 1 ELSE 0 END,
        ticket_5_count = daily_revenue.ticket_5_count + CASE WHEN NEW.ticket_type = 'paid_5' THEN 1 ELSE 0 END,
        free_quiz_count = daily_revenue.free_quiz_count + CASE WHEN NEW.ticket_type = 'free_quiz' THEN 1 ELSE 0 END,
        free_referral_count = daily_revenue.free_referral_count + CASE WHEN NEW.ticket_type = 'free_referral' THEN 1 ELSE 0 END,
        ticket_3_revenue = daily_revenue.ticket_3_revenue + CASE WHEN NEW.ticket_type = 'paid_3' THEN revenue_amount ELSE 0 END,
        ticket_5_revenue = daily_revenue.ticket_5_revenue + CASE WHEN NEW.ticket_type = 'paid_5' THEN revenue_amount ELSE 0 END,
        total_revenue = daily_revenue.total_revenue + revenue_amount;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create notification function for real-time updates
CREATE OR REPLACE FUNCTION notify_admin_update()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('admin_update', json_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'data', row_to_json(NEW)
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_draws_updated_at BEFORE UPDATE ON public.draws FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_charity_partners_updated_at BEFORE UPDATE ON public.charity_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER auto_referral_code BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION auto_generate_referral_code();
CREATE TRIGGER auto_entry_number BEFORE INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION auto_generate_entry_number();
CREATE TRIGGER update_user_stats_on_ticket AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_user_stats();
CREATE TRIGGER update_revenue_on_ticket_insert AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_daily_revenue();

-- Apply notification triggers for real-time admin updates
CREATE TRIGGER notify_ticket_changes AFTER INSERT OR UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION notify_admin_update();
CREATE TRIGGER notify_user_changes AFTER INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION notify_admin_update();
CREATE TRIGGER notify_referral_changes AFTER INSERT OR UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION notify_admin_update();

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- Tickets policies
CREATE POLICY "Users can read own tickets" ON public.tickets
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own tickets" ON public.tickets
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can read all tickets" ON public.tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can update tickets" ON public.tickets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- Referrals policies
CREATE POLICY "Users can read own referrals" ON public.referrals
    FOR SELECT USING (
        auth.uid()::text = referrer_id::text OR 
        auth.uid()::text = referee_id::text
    );

CREATE POLICY "Users can insert referrals" ON public.referrals
    FOR INSERT WITH CHECK (auth.uid()::text = referrer_id::text);

CREATE POLICY "Admins can read all referrals" ON public.referrals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can update referrals" ON public.referrals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- Draws policies (public read, admin write)
CREATE POLICY "Anyone can read draws" ON public.draws
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage draws" ON public.draws
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- Daily revenue policies (admin only)
CREATE POLICY "Admins can read revenue" ON public.daily_revenue
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can insert revenue" ON public.daily_revenue
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- Quiz attempts policies
CREATE POLICY "Users can read own quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can read all quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- Admin users policies
CREATE POLICY "Admins can read admin users" ON public.admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text AND role = 'super_admin'
        )
    );

-- Charity partners policies (public read, admin write)
CREATE POLICY "Anyone can read charity partners" ON public.charity_partners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage charity partners" ON public.charity_partners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- User sessions policies
CREATE POLICY "Users can read own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can read all sessions" ON public.user_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- Create useful views for analytics
CREATE VIEW public.user_analytics AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    u.created_at as registration_date,
    COUNT(t.id) as total_tickets,
    SUM(t.amount) as total_spent,
    COUNT(CASE WHEN t.ticket_type = 'paid_3' THEN 1 END) as paid_3_tickets,
    COUNT(CASE WHEN t.ticket_type = 'paid_5' THEN 1 END) as paid_5_tickets,
    COUNT(CASE WHEN t.ticket_type LIKE 'free_%' THEN 1 END) as free_tickets,
    COUNT(r.id) as referrals_made,
    COUNT(r2.id) as times_referred
FROM public.users u
LEFT JOIN public.tickets t ON u.id = t.user_id
LEFT JOIN public.referrals r ON u.id = r.referrer_id
LEFT JOIN public.referrals r2 ON u.id = r2.referee_id
GROUP BY u.id, u.full_name, u.email, u.created_at;

CREATE VIEW public.revenue_summary AS
SELECT 
    DATE(created_at) as date,
    ticket_type,
    COUNT(*) as count,
    SUM(amount) as revenue,
    AVG(amount) as avg_amount
FROM public.tickets
WHERE amount > 0
GROUP BY DATE(created_at), ticket_type
ORDER BY date DESC;

CREATE VIEW public.referral_performance AS
SELECT 
    u.full_name as referrer_name,
    u.email as referrer_email,
    u.referral_code,
    COUNT(r.id) as total_referrals,
    COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as successful_referrals,
    COUNT(rt.id) as free_tickets_earned,
    COALESCE(SUM(rt.amount), 0) as total_free_value
FROM public.users u
LEFT JOIN public.referrals r ON u.id = r.referrer_id
LEFT JOIN public.tickets rt ON r.reward_ticket_id = rt.id
GROUP BY u.id, u.full_name, u.email, u.referral_code
HAVING COUNT(r.id) > 0
ORDER BY successful_referrals DESC;

-- Insert sample data for testing
INSERT INTO public.users (id, email, full_name, phone, address) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@bigmoney.com', 'Admin User', '+1234567890', 'Admin City, ST'),
    ('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'John Doe', '+1234567891', 'New York, NY'),
    ('550e8400-e29b-41d4-a716-446655440002', 'jane@example.com', 'Jane Smith', '+1234567892', 'Los Angeles, CA'),
    ('550e8400-e29b-41d4-a716-446655440003', 'sarah@example.com', 'Sarah Wilson', '+1234567893', 'Chicago, IL'),
    ('550e8400-e29b-41d4-a716-446655440004', 'mike@example.com', 'Mike Johnson', '+1234567894', 'Houston, TX'),
    ('550e8400-e29b-41d4-a716-446655440005', 'lisa@example.com', 'Lisa Brown', '+1234567895', 'Phoenix, AZ'),
    ('550e8400-e29b-41d4-a716-446655440006', 'david@example.com', 'David Wilson', '+1234567896', 'Philadelphia, PA'),
    ('550e8400-e29b-41d4-a716-446655440007', 'amanda@example.com', 'Amanda Taylor', '+1234567897', 'San Antonio, TX'),
    ('550e8400-e29b-41d4-a716-446655440008', 'robert@example.com', 'Robert Harris', '+1234567898', 'San Diego, CA');

-- Make the first user a super admin
INSERT INTO public.admin_users (user_id, role, permissions) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'super_admin', ARRAY['read', 'write', 'delete', 'admin']);

-- Insert sample tickets for realistic data
INSERT INTO public.tickets (user_id, ticket_type, amount, draw_type, draw_date) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440001', 'paid_5', 5.00, '1000', '2025-01-30'),
    ('550e8400-e29b-41d4-a716-446655440001', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440002', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440002', 'free_quiz', 0.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440003', 'paid_5', 5.00, '1000', '2025-01-30'),
    ('550e8400-e29b-41d4-a716-446655440003', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440003', 'paid_5', 5.00, '1000', '2025-01-30'),
    ('550e8400-e29b-41d4-a716-446655440004', 'free_referral', 0.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440004', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440005', 'paid_5', 5.00, '1000', '2025-01-30'),
    ('550e8400-e29b-41d4-a716-446655440005', 'paid_5', 5.00, '1000', '2025-01-30'),
    ('550e8400-e29b-41d4-a716-446655440006', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440006', 'free_quiz', 0.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440007', 'paid_5', 5.00, '1000', '2025-01-30'),
    ('550e8400-e29b-41d4-a716-446655440008', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440008', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440008', 'paid_5', 5.00, '1000', '2025-01-30');

-- Insert sample referrals
INSERT INTO public.referrals (referrer_id, referee_id, referral_code, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'BM-ABC123', 'completed'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'BM-DEF456', 'completed'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'BM-GHI789', 'completed'),
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'BM-JKL012', 'pending'),
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', 'BM-MNO345', 'completed'),
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', 'BM-PQR678', 'completed'),
    ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', 'BM-STU901', 'pending');

-- Insert sample draws
INSERT INTO public.draws (draw_type, draw_date, total_entries, status, participants_hash, random_seed, result_hash, winner_id, winning_ticket_id) VALUES
    ('700', '2025-02-20', 150, 'upcoming', NULL, NULL, NULL, NULL, NULL),
    ('1000', '2025-01-30', 89, 'upcoming', NULL, NULL, NULL, NULL, NULL),
    ('700', '2024-12-20', 247, 'completed', 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456', 'dGhpcyBpcyBhIHNhbXBsZSBzZWVkIGZvciBkZW1vIHB1cnBvc2Vz', '9876543210fedcba0987654321fedcba09876543210fedcba0987654321fedcba', '550e8400-e29b-41d4-a716-446655440002', NULL),
    ('1000', '2024-11-30', 312, 'completed', 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a', 'YW5vdGhlciBzYW1wbGUgc2VlZCBmb3IgZGVtb25zdHJhdGlvbg==', '8765432109edcba098765432109edcba098765432109edcba098765432109edcba', '550e8400-e29b-41d4-a716-446655440003', NULL),
    ('700', '2024-10-20', 189, 'completed', 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2', 'dGhpcmQgc2FtcGxlIHNlZWQgZm9yIHZlcmlmaWNhdGlvbg==', '7654321098dcba087654321098dcba087654321098dcba087654321098dcba08', '550e8400-e29b-41d4-a716-446655440004', NULL),
    ('1000', '2024-09-30', 278, 'completed', 'd4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3', 'Zm91cnRoIHNhbXBsZSBzZWVkIGZvciBkZW1v', '6543210987cba0976543210987cba0976543210987cba0976543210987cba097', '550e8400-e29b-41d4-a716-446655440005', NULL);

-- Insert sample quiz attempts
INSERT INTO public.quiz_attempts (user_id, questions_answered, correct_answers, passed, time_taken) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 10, 10, true, 380),
    ('550e8400-e29b-41d4-a716-446655440003', 10, 7, false, 400),
    ('550e8400-e29b-41d4-a716-446655440004', 10, 8, false, 395),
    ('550e8400-e29b-41d4-a716-446655440006', 10, 10, true, 375),
    ('550e8400-e29b-41d4-a716-446655440007', 10, 6, false, 400),
    ('550e8400-e29b-41d4-a716-446655440008', 10, 9, false, 390);

-- Insert charity partners
INSERT INTO public.charity_partners (name, description, logo_url, website, focus_area, partnership_start, total_donated, impact_description, programs, contact_email) VALUES
    (
        'Feeding America',
        'The largest hunger-relief organization in the United States, providing food assistance to millions of Americans through food banks, food pantries, and meal programs.',
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&h=200&fit=crop',
        'feedingamerica.org',
        'Hunger Relief & Food Security',
        '2025-01-01',
        15750.00,
        'Provided 47,250 meals to families in need across 12 states',
        ARRAY['Mobile Food Pantries', 'School Backpack Programs', 'Senior Food Assistance'],
        'partnerships@feedingamerica.org'
    ),
    (
        'Boys & Girls Clubs of America',
        'Provides safe places for kids and teens to learn, grow, and develop into productive, caring, responsible citizens through after-school and summer programs.',
        'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=200&fit=crop',
        'bgca.org',
        'Youth Development & Education',
        '2025-01-01',
        12300.00,
        'Supported 410 at-risk youth with educational programs and mentorship',
        ARRAY['STEM Education', 'College Prep', 'Leadership Development'],
        'partnerships@bgca.org'
    ),
    (
        'Habitat for Humanity',
        'Builds affordable housing and promotes homeownership as a means to break the cycle of poverty. Partners with families to build strength, stability and independence.',
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop',
        'habitat.org',
        'Affordable Housing & Community Development',
        '2025-02-01',
        18900.00,
        'Helped build 3 complete homes for low-income families',
        ARRAY['Home Construction', 'Home Repairs', 'Financial Literacy'],
        'partnerships@habitat.org'
    ),
    (
        'American Red Cross',
        'Provides emergency assistance, disaster relief, and disaster preparedness education in communities across the United States and internationally.',
        'https://images.unsplash.com/photo-1584515933487-779824d29309?w=200&h=200&fit=crop',
        'redcross.org',
        'Disaster Relief & Emergency Response',
        '2025-02-01',
        9800.00,
        'Supported disaster relief efforts for 2,450 families affected by natural disasters',
        ARRAY['Disaster Response', 'Blood Drives', 'Emergency Preparedness'],
        'partnerships@redcross.org'
    ),
    (
        'United Way',
        'Fights for the health, education, and financial stability of every person in every community. Focuses on creating long-lasting change by addressing root causes of problems.',
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop',
        'unitedway.org',
        'Community Health & Financial Stability',
        '2025-03-01',
        11200.00,
        'Funded financial literacy programs for 560 families and job training for 180 individuals',
        ARRAY['Financial Coaching', 'Job Training', 'Healthcare Access'],
        'partnerships@unitedway.org'
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant read access to anon for public data
GRANT SELECT ON public.draws TO anon;
GRANT SELECT ON public.charity_partners TO anon;

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User profiles and account information with referral tracking';
COMMENT ON TABLE public.tickets IS 'All ticket purchases and entries with verification data';
COMMENT ON TABLE public.referrals IS 'Referral tracking and reward system';
COMMENT ON TABLE public.draws IS 'Draw events with cryptographic verification data';
COMMENT ON TABLE public.daily_revenue IS 'Daily revenue aggregation with detailed breakdowns';
COMMENT ON TABLE public.quiz_attempts IS 'Free entry quiz attempts with fraud prevention';
COMMENT ON TABLE public.admin_users IS 'Admin user permissions and role management';
COMMENT ON TABLE public.charity_partners IS 'Charity organization partnerships and donation tracking';
COMMENT ON TABLE public.user_sessions IS 'User session tracking for analytics and security';

-- Final verification query to check everything was created successfully
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'tickets', 'referrals', 'draws', 'daily_revenue', 'quiz_attempts', 'admin_users', 'charity_partners', 'user_sessions')
ORDER BY tablename;