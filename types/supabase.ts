export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          role: string
          stripe_customer_id: string | null
          subscription_status: string
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: string
          stripe_customer_id?: string | null
          subscription_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: string
          stripe_customer_id?: string | null
          subscription_status?: string
          created_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string | null
          type: 'image' | 'video'
          prompt: string | null
          result_url: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: 'image' | 'video'
          prompt?: string | null
          result_url?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'image' | 'video'
          prompt?: string | null
          result_url?: string | null
          status?: string
          created_at?: string
        }
      }
    }
  }
}
