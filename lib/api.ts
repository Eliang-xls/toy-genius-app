import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// === API Functions ===

export interface Product {
  id: string;
  name_display: string;
  image_url: string | null;
  age_min_yr: number;
  age_max_yr: number;
  price_tier: number;
  scraped_price: string;
  product_category: string[];
  material: string[];
  play_pattern: string;
  gender_preference: string;
  safety_concern: string[];
  brand_name: string;
  ai_description: string | null;
  safety_score: number | null;
  certifications: any;
  user_feedback_analysis: any;
  cross_validation: any;
  safety_notes: string | null;
  safety_scoring_rationale: string | null;
  has_safety_data: boolean;
  base_score: string;
  d_safety: string;
  d_education: string;
  d_sensory: string;
  d_motor: string;
  d_language: string;
  d_creativity: string;
  d_science: string;
  d_emotions: string;
  top_tag_ids: string[];
}

export type AgeFilter = 'all' | '0-1' | '1-3' | '3-5' | '5-8' | '8+';

const AGE_RANGES: Record<Exclude<AgeFilter, 'all'>, { min: number; max: number }> = {
  '0-1': { min: 0, max: 1 },
  '1-3': { min: 1, max: 3 },
  '3-5': { min: 3, max: 5 },
  '5-8': { min: 5, max: 8 },
  '8+': { min: 8, max: 100 },
};

export async function fetchProducts(
  filter: AgeFilter = 'all',
  offset = 0,
  limit = 20
): Promise<Product[]> {
  let query = supabase
    .from('mv_product_browse')
    .select('*')
    .order('base_score', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filter !== 'all') {
    const range = AGE_RANGES[filter];
    query = query
      .lte('age_min_yr', range.max)
      .gte('age_max_yr', range.min);
  }

  const { data, error } = await query;

  if (error) {
    console.error('fetchProducts error:', error);
    throw error;
  }

  return data || [];
}

export async function fetchProductDetail(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('v_product_detail')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('fetchProductDetail error:', error);
    throw error;
  }

  return data;
}

export interface MilestoneToy {
  milestone_id: string;
  milestone_name: string;
  domain: string;
  match_score: number;
  product_id: string;
}

export async function fetchMilestoneToys(
  productId?: string,
  limit = 3
): Promise<MilestoneToy[]> {
  let query = supabase
    .from('v_milestone_toys')
    .select('*')
    .order('match_score', { ascending: false })
    .limit(limit);

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('fetchMilestoneToys error:', error);
    throw error;
  }

  return data || [];
}
