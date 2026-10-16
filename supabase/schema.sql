-- ==============================================================================
-- 0XNULL Relational Database Schema (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('student', 'admin')) DEFAULT 'student',
  department TEXT DEFAULT 'Department of Cybersecurity',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DOMAINS TABLE (Seven Core Tracks)
CREATE TABLE IF NOT EXISTS public.domains (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  badge TEXT NOT NULL,
  tagline TEXT NOT NULL,
  overview TEXT NOT NULL,
  focus_areas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESOURCES TABLE (Whitepapers, Toolkits, Blueprints)
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain_id TEXT REFERENCES public.domains(id) ON DELETE SET NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CERTIFICATIONS TABLE (Industry Standards Roadmap)
CREATE TABLE IF NOT EXISTS public.certifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  domain_id TEXT REFERENCES public.domains(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  exam_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECTS TABLE (Member-authored toolchains)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  domain_id TEXT REFERENCES public.domains(id) ON DELETE SET NULL,
  difficulty TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('Active Lab', 'In Research', 'Production Ready', 'Completed')) NOT NULL,
  repository_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACTIVITIES & EVENTS TABLE (Twelve Core Formats)
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  format TEXT NOT NULL,
  frequency TEXT NOT NULL,
  description TEXT NOT NULL,
  participants TEXT NOT NULL,
  domain_id TEXT REFERENCES public.domains(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ANNOUNCEMENTS TABLE (Dispatch & Memos)
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. USER PROGRESS & TELEMETRY
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER SAVED RESOURCES (M2M)
CREATE TABLE IF NOT EXISTS public.user_saved_resources (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_id)
);

-- 10. USER ENROLLED DOMAINS (M2M)
CREATE TABLE IF NOT EXISTS public.user_domains (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain_id TEXT REFERENCES public.domains(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, domain_id)
);

-- 11. USER TRACKED CERTIFICATIONS (M2M)
CREATE TABLE IF NOT EXISTS public.user_certifications (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  certification_id TEXT REFERENCES public.certifications(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('tracking', 'in_progress', 'certified')) DEFAULT 'tracking',
  tracked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, certification_id)
);

-- 12. USER ACTIVITY RSVPS (M2M)
CREATE TABLE IF NOT EXISTS public.user_activity_rsvps (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id TEXT REFERENCES public.activities(id) ON DELETE CASCADE,
  rsvp_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, activity_id)
);

-- 13. CLUB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.club_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  year TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  branch TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')) DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. APPLICATION DOMAIN INTERESTS (M2M with Composite Primary Key)
CREATE TABLE IF NOT EXISTS public.application_domain_interests (
  application_id UUID REFERENCES public.club_applications(id) ON DELETE CASCADE,
  domain_id TEXT REFERENCES public.domains(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (application_id, domain_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_domain_interests ENABLE ROW LEVEL SECURITY;

-- Public read access for ecosystem tables
CREATE POLICY "Public read domains" ON public.domains FOR SELECT USING (true);
CREATE POLICY "Public read resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public read certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);

-- User-specific access policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own saved resources" ON public.user_saved_resources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own enrolled domains" ON public.user_domains FOR ALL USING (auth.uid() = user_id);

-- Application RLS: Users can create and view their own applications. Admins can view/update all.
CREATE POLICY "Users can view own applications" ON public.club_applications
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can submit applications" ON public.club_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update applications" ON public.club_applications
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users and admins view application domains" ON public.application_domain_interests
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.club_applications app 
    WHERE app.id = application_id AND (app.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  ));

CREATE POLICY "Users can insert application domains" ON public.application_domain_interests
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.club_applications app 
    WHERE app.id = application_id AND app.user_id = auth.uid()
  ));
