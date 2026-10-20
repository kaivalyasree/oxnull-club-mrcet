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

-- 4. CREATE LEARNING_SUBJECTS TABLE (ADDITIVE)
CREATE TABLE IF NOT EXISTS public.learning_subjects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  key_concepts TEXT[] DEFAULT '{}',
  hands_on_lab TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial 4 foundational learning subjects if not present
INSERT INTO public.learning_subjects (id, slug, number, title, subtitle, description, key_concepts, hands_on_lab)
VALUES
  (
    'linux',
    'linux',
    '01',
    'Linux',
    'Command Line, Scripting, Permissions & Toolchains',
    'Linux is the de facto operating system of cloud infrastructure, security tools, and forensic environments. Command line fluency and shell automation are essential skills for every cybersecurity practitioner.',
    ARRAY['BASH command line navigation, pipes, grep, sed, and awk', 'POSIX user, group, and other permissions (chmod, chown, SUID/SGID)', 'Systemd services, journalctl logs, and background daemons', 'Automating recon and triage tasks using Bash & Python scripts'],
    'Harden an Ubuntu server by locking down SSH, configuring UFW firewall rules, and auditing SUID binaries.'
  ),
  (
    'networking',
    'networking',
    '02',
    'Networking',
    'TCP/IP, Routing, DNS & Layered Traffic',
    'Network communication is the circulatory system of modern technology. Students master packet encapsulation, protocol headers, DNS resolution, and traffic inspection.',
    ARRAY['OSI 7-Layer model & TCP/IP stack mapping', 'Three-way handshake (SYN, SYN-ACK, ACK) and teardown', 'Subnetting, CIDR notation, and IP routing tables', 'DNS recursive resolution hierarchy and TLS handshake basics'],
    'Capture live HTTP vs HTTPS handshakes in Wireshark and trace every protocol header byte across layers 2 through 7.'
  ),
  (
    'operating-system',
    'operating-system',
    '03',
    'Operating System',
    'Processes, Memory Models, Filesystems & Kernel Basics',
    'The operating system governs all program execution. Understanding process privilege rings, system calls, virtual memory, and kernel primitives is crucial for both attack and defense.',
    ARRAY['Ring 0 (Kernel) vs Ring 3 (User space) separation', 'Process trees, thread scheduling, and PID lifecycles', 'Virtual memory, page tables, and memory protection (DEP/NX, ASLR)', 'Filesystem structures: Inodes, metadata, and access permissions'],
    'Write a small program that inspects its own memory mappings via /proc/self/maps on Linux.'
  ),
  (
    'security-fundamentals',
    'security-fundamentals',
    '04',
    'Security Fundamentals',
    'Threat Models, Defence Vocabulary, CIA Triad & Attack Surfaces',
    'The universal conceptual lens through which all security decisions are evaluated, balancing confidentiality, integrity, availability, and threat modeling.',
    ARRAY['Confidentiality, Integrity, Availability (CIA Triad)', 'Threat actors, vulnerability vs exploit vs risk definition', 'Attack surface analysis and principle of least privilege', 'Authentication, Authorization, and Non-repudiation (AAA)'],
    'Perform a comprehensive attack surface audit of an open-source web application and catalog its attack vectors.'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. PERFORMANCE & FILTERING INDEXES
CREATE INDEX IF NOT EXISTS idx_resources_published ON public.resources (is_published);
CREATE INDEX IF NOT EXISTS idx_resources_domain_id ON public.resources (domain_id);
CREATE INDEX IF NOT EXISTS idx_resources_subject_id ON public.resources (subject_id);

CREATE INDEX IF NOT EXISTS idx_certifications_published ON public.certifications (is_published);
CREATE INDEX IF NOT EXISTS idx_certifications_domain_id ON public.certifications (domain_id);

CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects (is_published);
CREATE INDEX IF NOT EXISTS idx_projects_domain_id ON public.projects (domain_id);

CREATE INDEX IF NOT EXISTS idx_learning_subjects_slug ON public.learning_subjects (slug);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES UPGRADE
-- Enable RLS on core content tables
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_subjects ENABLE ROW LEVEL SECURITY;

-- 6.1 RESOURCES POLICIES
DROP POLICY IF EXISTS "Public read resources" ON public.resources;
DROP POLICY IF EXISTS "Public read published resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can insert resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can update resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can delete resources" ON public.resources;

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

-- 6.2 CERTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Public read certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public read published certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admins can manage certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admins can insert certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admins can update certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admins can delete certifications" ON public.certifications;

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

-- 6.3 PROJECTS POLICIES
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

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

-- 6.4 DOMAINS POLICIES
DROP POLICY IF EXISTS "Public read domains" ON public.domains;
DROP POLICY IF EXISTS "Admins can update domains" ON public.domains;

CREATE POLICY "Public read domains" ON public.domains
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can update domains" ON public.domains
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 6.5 LEARNING SUBJECTS POLICIES
DROP POLICY IF EXISTS "Public read learning_subjects" ON public.learning_subjects;
DROP POLICY IF EXISTS "Admins can update learning_subjects" ON public.learning_subjects;
DROP POLICY IF EXISTS "Admins can insert learning_subjects" ON public.learning_subjects;

CREATE POLICY "Public read learning_subjects" ON public.learning_subjects
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can update learning_subjects" ON public.learning_subjects
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert learning_subjects" ON public.learning_subjects
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 7. SUPABASE STORAGE BUCKET CONFIGURATION (Safe & Optional)
-- Creates 'club-assets' bucket for vetted documents, thumbnails, & diagrams
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'club-assets',
  'club-assets',
  true,
  10485760, -- 10 MB maximum upload limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

-- Storage RLS: Public read, Admin write/update/delete
DROP POLICY IF EXISTS "Public read club-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload club-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins update club-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete club-assets" ON storage.objects;

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

CREATE POLICY "Admins update club-assets" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'club-assets'
    AND (
      auth.role() = 'service_role'
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );

CREATE POLICY "Admins delete club-assets" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'club-assets'
    AND (
      auth.role() = 'service_role'
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );
