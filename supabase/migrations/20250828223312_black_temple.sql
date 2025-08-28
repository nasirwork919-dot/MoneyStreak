-- BigMoney Complete Database Schema with RLS Policies
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    referral_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
    reward_ticket_id UUID REFERENCES public.tickets(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(referrer_id, referee_id)
);

-- Draws table
CREATE TABLE IF NOT EXISTS public.draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_type TEXT NOT NULL CHECK (draw_type IN ('700', '1000')),
    draw_date DATE NOT NULL,
    winner_id UUID REFERENCES public.users(id),
    winning_ticket_id UUID REFERENCES public.tickets(id),
    total_entries INTEGER NOT NULL DEFAULT 0,
    participants_hash TEXT,
    random_seed TEXT,
    result_hash TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'paid')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(draw_type, draw_date)
);

-- Daily revenue aggregation table
CREATE TABLE IF NOT EXISTS public.daily_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    ticket_3_count INTEGER NOT NULL DEFAULT 0,
    ticket_5_count INTEGER NOT NULL DEFAULT 0,
    ticket_3_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    ticket_5_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    questions_answered INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    ticket_awarded UUID REFERENCES public.tickets(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, DATE(created_at))
);

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    permissions TEXT[] DEFAULT ARRAY['read', 'write'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_draw_date ON public.tickets(draw_date);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_id ON public.referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_draws_draw_date ON public.draws(draw_date);
CREATE INDEX IF NOT EXISTS idx_daily_revenue_date ON public.daily_revenue(date);

-- Functions for automatic referral code generation
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'BM-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- Function to generate entry numbers
CREATE OR REPLACE FUNCTION generate_entry_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'BM-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('entry_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for entry numbers
CREATE SEQUENCE IF NOT EXISTS entry_number_seq START 1;

-- Triggers for automatic field population
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_draws_updated_at BEFORE UPDATE ON public.draws FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-generate referral codes
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code = generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_referral_code BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION auto_generate_referral_code();

-- Trigger to auto-generate entry numbers
CREATE OR REPLACE FUNCTION auto_generate_entry_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.entry_number IS NULL THEN
        NEW.entry_number = generate_entry_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_entry_number BEFORE INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION auto_generate_entry_number();

-- Function to update daily revenue
CREATE OR REPLACE FUNCTION update_daily_revenue()
RETURNS TRIGGER AS $$
DECLARE
    ticket_date DATE;
    revenue_amount DECIMAL(10,2);
BEGIN
    ticket_date = DATE(NEW.created_at);
    revenue_amount = NEW.amount;
    
    INSERT INTO public.daily_revenue (date, ticket_3_count, ticket_5_count, ticket_3_revenue, ticket_5_revenue, total_revenue)
    VALUES (
        ticket_date,
        CASE WHEN NEW.ticket_type = 'paid_3' THEN 1 ELSE 0 END,
        CASE WHEN NEW.ticket_type = 'paid_5' THEN 1 ELSE 0 END,
        CASE WHEN NEW.ticket_type = 'paid_3' THEN revenue_amount ELSE 0 END,
        CASE WHEN NEW.ticket_type = 'paid_5' THEN revenue_amount ELSE 0 END,
        revenue_amount
    )
    ON CONFLICT (date) DO UPDATE SET
        ticket_3_count = daily_revenue.ticket_3_count + CASE WHEN NEW.ticket_type = 'paid_3' THEN 1 ELSE 0 END,
        ticket_5_count = daily_revenue.ticket_5_count + CASE WHEN NEW.ticket_type = 'paid_5' THEN 1 ELSE 0 END,
        ticket_3_revenue = daily_revenue.ticket_3_revenue + CASE WHEN NEW.ticket_type = 'paid_3' THEN revenue_amount ELSE 0 END,
        ticket_5_revenue = daily_revenue.ticket_5_revenue + CASE WHEN NEW.ticket_type = 'paid_5' THEN revenue_amount ELSE 0 END,
        total_revenue = daily_revenue.total_revenue + revenue_amount;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_revenue_on_ticket_insert AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_daily_revenue();

-- RLS Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Admin can read all users
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

-- Admin can read all tickets
CREATE POLICY "Admins can read all tickets" ON public.tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- Admin can update tickets
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

-- Admin can read all referrals
CREATE POLICY "Admins can read all referrals" ON public.referrals
    FOR SELECT USING (
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

-- Quiz attempts policies
CREATE POLICY "Users can read own quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Admin can read all quiz attempts
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

-- Super admins can manage admin users
CREATE POLICY "Super admins can manage admin users" ON public.admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id::text = auth.uid()::text AND role = 'super_admin'
        )
    );

-- Insert sample data for testing
INSERT INTO public.users (id, email, full_name, phone) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@bigmoney.com', 'Admin User', '+1234567890'),
    ('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'John Doe', '+1234567891'),
    ('550e8400-e29b-41d4-a716-446655440002', 'jane@example.com', 'Jane Smith', '+1234567892')
ON CONFLICT (email) DO NOTHING;

-- Make the first user an admin
INSERT INTO public.admin_users (user_id, role, permissions) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'super_admin', ARRAY['read', 'write', 'delete'])
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample tickets
INSERT INTO public.tickets (user_id, ticket_type, amount, draw_type, draw_date) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440001', 'paid_5', 5.00, '1000', '2025-01-30'),
    ('550e8400-e29b-41d4-a716-446655440002', 'paid_3', 3.00, '700', '2025-02-20'),
    ('550e8400-e29b-41d4-a716-446655440002', 'free_quiz', 0.00, '700', '2025-02-20');

-- Insert sample referrals
INSERT INTO public.referrals (referrer_id, referee_id, referral_code, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'BM-ABC123', 'completed');

-- Insert sample draws
INSERT INTO public.draws (draw_type, draw_date, total_entries, status) VALUES
    ('700', '2025-02-20', 150, 'upcoming'),
    ('1000', '2025-01-30', 89, 'upcoming');

-- Create views for easier querying
CREATE OR REPLACE VIEW public.ticket_summary AS
SELECT 
    DATE(created_at) as date,
    ticket_type,
    COUNT(*) as count,
    SUM(amount) as revenue
FROM public.tickets
GROUP BY DATE(created_at), ticket_type
ORDER BY date DESC;

CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    COUNT(t.id) as total_tickets,
    SUM(t.amount) as total_spent,
    COUNT(r.id) as referrals_made
FROM public.users u
LEFT JOIN public.tickets t ON u.id = t.user_id
LEFT JOIN public.referrals r ON u.id = r.referrer_id
GROUP BY u.id, u.full_name, u.email;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant read access to anon for public data
GRANT SELECT ON public.draws TO anon;
GRANT SELECT ON public.users TO anon;

COMMENT ON TABLE public.users IS 'User profiles and account information';
COMMENT ON TABLE public.tickets IS 'All ticket purchases and entries';
COMMENT ON TABLE public.referrals IS 'Referral tracking and rewards';
COMMENT ON TABLE public.draws IS 'Draw events and results';
COMMENT ON TABLE public.daily_revenue IS 'Daily revenue aggregation';
COMMENT ON TABLE public.quiz_attempts IS 'Free entry quiz attempts';
COMMENT ON TABLE public.admin_users IS 'Admin user permissions';