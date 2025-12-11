/*
  # Initial Film Shoot Tracking App Schema

  1. New Tables
    - `users`
      - `user_id` (bigint, primary key, auto-generated)
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `crew_types`
      - `crew_id` (bigint, primary key, auto-generated)
      - `crew_name` (text)
      - `created_at` (timestamptz)
    
    - `film_projects`
      - `project_id` (bigint, primary key, auto-generated)
      - `project_name` (text)
      - `producer_company` (text)
      - `description` (text)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `film_shoots`
      - `shoot_id` (bigint, primary key, auto-generated)
      - `project_id` (bigint, references film_projects)
      - `description` (text)
      - `location_street_address` (text)
      - `location_city` (text)
      - `location_state` (text)
      - `location_country` (text)
      - `location_lat` (numeric) - for geolocation
      - `location_lng` (numeric) - for geolocation
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `contact_info` (text)
      - `rideshare_info` (text)
      - `image_urls` (text[]) - array of image URLs
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_crew_types`
      - Junction table linking users to their crew type skills
      - `user_id` (bigint, references users)
      - `crew_id` (bigint, references crew_types)
      - Primary key: (user_id, crew_id)
    
    - `shoot_crew_types_requested`
      - Junction table for crew types needed for shoots
      - `shoot_id` (bigint, references film_shoots)
      - `crew_id` (bigint, references crew_types)
      - Primary key: (shoot_id, crew_id)

  2. Security
    - Enable RLS on all tables
    - Users can read their own profile data
    - Users can update their own profile
    - Anyone authenticated can read film projects and shoots
    - Only creators can update/delete their own projects and shoots
    - Authenticated users can create new projects and shoots
*/

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  user_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crew_types table
CREATE TABLE IF NOT EXISTS crew_types (
  crew_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  crew_name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create film_projects table
CREATE TABLE IF NOT EXISTS film_projects (
  project_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_name text NOT NULL,
  producer_company text NOT NULL,
  description text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create film_shoots table with geolocation
CREATE TABLE IF NOT EXISTS film_shoots (
  shoot_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_id bigint REFERENCES film_projects(project_id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  location_street_address text NOT NULL,
  location_city text NOT NULL,
  location_state text NOT NULL,
  location_country text NOT NULL DEFAULT 'USA',
  location_lat numeric(10, 8),
  location_lng numeric(11, 8),
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  contact_info text,
  rideshare_info text,
  image_urls text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_crew_types junction table
CREATE TABLE IF NOT EXISTS user_crew_types (
  user_id bigint REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
  crew_id bigint REFERENCES crew_types(crew_id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (user_id, crew_id)
);

-- Create shoot_crew_types_requested junction table
CREATE TABLE IF NOT EXISTS shoot_crew_types_requested (
  shoot_id bigint REFERENCES film_shoots(shoot_id) ON DELETE CASCADE NOT NULL,
  crew_id bigint REFERENCES crew_types(crew_id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (shoot_id, crew_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_film_shoots_project_id ON film_shoots(project_id);
CREATE INDEX IF NOT EXISTS idx_film_shoots_start_time ON film_shoots(start_time);
CREATE INDEX IF NOT EXISTS idx_film_shoots_created_by ON film_shoots(created_by);
CREATE INDEX IF NOT EXISTS idx_film_projects_created_by ON film_projects(created_by);
CREATE INDEX IF NOT EXISTS idx_user_crew_types_user_id ON user_crew_types(user_id);
CREATE INDEX IF NOT EXISTS idx_user_crew_types_crew_id ON user_crew_types(crew_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE film_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE film_shoots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_crew_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_crew_types_requested ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for crew_types table
CREATE POLICY "Anyone can view crew types"
  ON crew_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create crew types"
  ON crew_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for film_projects table
CREATE POLICY "Anyone can view film projects"
  ON film_projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create projects"
  ON film_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own projects"
  ON film_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own projects"
  ON film_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for film_shoots table
CREATE POLICY "Anyone can view film shoots"
  ON film_shoots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create shoots"
  ON film_shoots FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own shoots"
  ON film_shoots FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own shoots"
  ON film_shoots FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for user_crew_types table
CREATE POLICY "Users can view all crew type associations"
  ON user_crew_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own crew types"
  ON user_crew_types FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = user_crew_types.user_id
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own crew types"
  ON user_crew_types FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = user_crew_types.user_id
      AND users.id = auth.uid()
    )
  );

-- RLS Policies for shoot_crew_types_requested table
CREATE POLICY "Anyone can view requested crew types"
  ON shoot_crew_types_requested FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Shoot creators can manage requested crew types"
  ON shoot_crew_types_requested FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM film_shoots
      WHERE film_shoots.shoot_id = shoot_crew_types_requested.shoot_id
      AND film_shoots.created_by = auth.uid()
    )
  );

CREATE POLICY "Shoot creators can delete requested crew types"
  ON shoot_crew_types_requested FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM film_shoots
      WHERE film_shoots.shoot_id = shoot_crew_types_requested.shoot_id
      AND film_shoots.created_by = auth.uid()
    )
  );

-- Insert some default crew types
INSERT INTO crew_types (crew_name) VALUES
  ('Director'),
  ('Producer'),
  ('Cinematographer'),
  ('Camera Operator'),
  ('Gaffer'),
  ('Key Grip'),
  ('Sound Mixer'),
  ('Boom Operator'),
  ('Production Designer'),
  ('Art Director'),
  ('Costume Designer'),
  ('Makeup Artist'),
  ('Editor'),
  ('Assistant Director'),
  ('Production Assistant'),
  ('Script Supervisor'),
  ('Actor'),
  ('Extra'),
  ('Stunt Coordinator'),
  ('Visual Effects Artist')
ON CONFLICT (crew_name) DO NOTHING;