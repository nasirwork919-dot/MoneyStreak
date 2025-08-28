import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  user_id: string
  entry_number: string
  ticket_type: 'paid_3' | 'paid_5' | 'free_quiz' | 'free_referral'
  amount: number
  draw_type: '700' | '1000'
  draw_date: string
  status: 'active' | 'drawn' | 'won' | 'expired'
  payment_id?: string
  referral_code?: string
  created_at: string
  updated_at: string
  user?: User
}

export interface Referral {
  id: string
  referrer_id: string
  referee_id: string
  referral_code: string
  status: 'pending' | 'completed' | 'rewarded'
  reward_ticket_id?: string
  created_at: string
  updated_at: string
  referrer?: User
  referee?: User
}

export interface Draw {
  id: string
  draw_type: '700' | '1000'
  draw_date: string
  winner_id?: string
  winning_ticket_id?: string
  total_entries: number
  participants_hash: string
  random_seed: string
  result_hash: string
  status: 'upcoming' | 'completed' | 'paid'
  created_at: string
  updated_at: string
  winner?: User
  winning_ticket?: Ticket
}

export interface Revenue {
  id: string
  date: string
  ticket_3_count: number
  ticket_5_count: number
  ticket_3_revenue: number
  ticket_5_revenue: number
  total_revenue: number
  created_at: string
}