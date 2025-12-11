import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  user_id: number;
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type CrewType = {
  crew_id: number;
  crew_name: string;
  created_at: string;
};

export type FilmProject = {
  project_id: number;
  project_name: string;
  producer_company: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type FilmShoot = {
  shoot_id: number;
  project_id: number;
  description: string;
  location_street_address: string;
  location_city: string;
  location_state: string;
  location_country: string;
  location_lat?: number;
  location_lng?: number;
  start_time: string;
  end_time?: string;
  contact_info?: string;
  rideshare_info?: string;
  image_urls?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  film_projects?: FilmProject;
  shoot_crew_types_requested?: { crew_types: CrewType }[];
};
