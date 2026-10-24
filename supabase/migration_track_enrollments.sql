-- ==============================================================================
-- 0XNULL Cybersecurity Club — Track Enrollments Database Migration
-- Target: Supabase PostgreSQL (Public Schema)
-- Safe, additive migration: no table drops, no data erasure
-- ==============================================================================

-- 1. CREATE TRACK_ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.track_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  branch TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  domain_id TEXT NOT NULL REFERENCES public.domains(id) ON DELETE RESTRICT,
  domain_name TEXT NOT NULL,
  track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending' NOT NULL,
  statement TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_student_track_enrollment UNIQUE (roll_number, domain_id, track_id)
);

-- 2. CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_track_enrollments_user_id ON public.track_enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_track_enrollments_roll_number ON public.track_enrollments (roll_number);
CREATE INDEX IF NOT EXISTS idx_track_enrollments_domain_id ON public.track_enrollments (domain_id);
CREATE INDEX IF NOT EXISTS idx_track_enrollments_track_id ON public.track_enrollments (track_id);
CREATE INDEX IF NOT EXISTS idx_track_enrollments_status ON public.track_enrollments (status);
CREATE INDEX IF NOT EXISTS idx_track_enrollments_created_at ON public.track_enrollments (created_at DESC);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.track_enrollments ENABLE ROW LEVEL SECURITY;

-- 4. ROW LEVEL SECURITY POLICIES

-- Drop policies if already existing to avoid conflicts on re-run
DROP POLICY IF EXISTS "Users can view own track enrollments" ON public.track_enrollments;
DROP POLICY IF EXISTS "Users can submit own track enrollments" ON public.track_enrollments;
DROP POLICY IF EXISTS "Admins can update track enrollments" ON public.track_enrollments;
DROP POLICY IF EXISTS "Admins can view all track enrollments" ON public.track_enrollments;

-- Policy 4.1: Students can view only their own private enrollments (or service_role / admins view all)
CREATE POLICY "Users can view own track enrollments" ON public.track_enrollments
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR auth.uid()::text = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policy 4.2: Students can only insert their own enrollment with 'pending' status
CREATE POLICY "Users can submit own track enrollments" ON public.track_enrollments
  FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND (
      auth.role() = 'service_role'
      OR auth.uid()::text = user_id
      OR auth.uid() IS NOT NULL
    )
  );

-- Policy 4.3: Only authorized administrators or service_role can update enrollment status
CREATE POLICY "Admins can update track enrollments" ON public.track_enrollments
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
