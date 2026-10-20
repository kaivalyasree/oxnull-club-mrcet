-- ==============================================================================
-- 0XNULL Security Club — Safe Non-Destructive CMS Upgrade Migration
-- Targets: Supabase PostgreSQL Database & Storage
-- Safe for existing production data (No table drops, no data erasure)
-- ==============================================================================

-- 1. EXTEND RESOURCES TABLE WITH CMS FIELDS
ALTER TABLE IF EXISTS public.resources
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS subject_id TEXT,
  ADD COLUMN IF NOT EXISTS subject_name TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. EXTEND CERTIFICATIONS TABLE WITH CMS FIELDS
ALTER TABLE IF EXISTS public.certifications
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS cost TEXT DEFAULT 'Paid',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. EXTEND PROJECTS TABLE WITH CMS FIELDS
ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS thumbnail TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. PERFORMANCE & FILTERING INDEXES
CREATE INDEX IF NOT EXISTS idx_resources_published ON public.resources (is_published);
CREATE INDEX IF NOT EXISTS idx_resources_domain_id ON public.resources (domain_id);
CREATE INDEX IF NOT EXISTS idx_resources_subject_id ON public.resources (subject_id);

CREATE INDEX IF NOT EXISTS idx_certifications_published ON public.certifications (is_published);
CREATE INDEX IF NOT EXISTS idx_certifications_domain_id ON public.certifications (domain_id);

CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects (is_published);
CREATE INDEX IF NOT EXISTS idx_projects_domain_id ON public.projects (domain_id);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES UPGRADE
-- Enable RLS on core content tables
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5.1 RESOURCES POLICIES
-- Drop legacy wide-open read policy if it exists
DROP POLICY IF EXISTS "Public read resources" ON public.resources;
DROP POLICY IF EXISTS "Public read published resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;

-- Public can ONLY read published resources (drafts hidden from regular visitors)
CREATE POLICY "Public read published resources" ON public.resources
  FOR SELECT
  USING (
    is_published = true 
    OR auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Only authenticated administrators or service_role can create, update, or delete resources
CREATE POLICY "Admins can insert resources" ON public.resources
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update resources" ON public.resources
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete resources" ON public.resources
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5.2 CERTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Public read certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public read published certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admins can manage certifications" ON public.certifications;

CREATE POLICY "Public read published certifications" ON public.certifications
  FOR SELECT
  USING (
    is_published = true 
    OR auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert certifications" ON public.certifications
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update certifications" ON public.certifications
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete certifications" ON public.certifications
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5.3 PROJECTS POLICIES
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;

CREATE POLICY "Public read published projects" ON public.projects
  FOR SELECT
  USING (
    is_published = true 
    OR auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 6. SUPABASE STORAGE BUCKET CONFIGURATION (Safe & Optional)
-- Creates 'club-assets' bucket for vetted document & diagram uploads if storage extension is active
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'club-assets',
  'club-assets',
  true,
  10485760, -- 10 MB maximum upload limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

-- Storage RLS: Public read, Admin write
DROP POLICY IF EXISTS "Public read club-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload club-assets" ON storage.objects;

CREATE POLICY "Public read club-assets" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'club-assets');

CREATE POLICY "Admins upload club-assets" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'club-assets'
    AND (
      auth.role() = 'service_role'
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );
