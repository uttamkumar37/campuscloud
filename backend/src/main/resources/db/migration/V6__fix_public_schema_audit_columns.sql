-- V6: Backfill missing audit columns on legacy public-schema tenant tables
-- that were created outside Flyway on pre-existing dev databases.
--
-- On a FRESH Docker install these tables do not exist in the public schema
-- (they live only in per-tenant schemas created by TenantServiceImpl), so every
-- ALTER TABLE block is wrapped in a DO $$ IF EXISTS $$ guard — making this
-- migration a safe no-op on a clean database.

DO $$ BEGIN
  -- ─── USERS ──────────────────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'users') THEN
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tenant_id   VARCHAR(80);
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_by  UUID;
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ;
  END IF;

  -- ─── STUDENTS ───────────────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'students') THEN
    ALTER TABLE public.students ADD COLUMN IF NOT EXISTS user_id     UUID;
    ALTER TABLE public.students ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.students ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.students ADD COLUMN IF NOT EXISTS updated_by  UUID;
    ALTER TABLE public.students ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ;
  END IF;

  -- ─── TEACHERS ───────────────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'teachers') THEN
    ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS user_id     UUID;
    ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS updated_by  UUID;
    ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ;
  END IF;

  -- ─── ATTENDANCE_RECORDS ─────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'attendance_records') THEN
    ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS updated_by  UUID;
  END IF;

  -- ─── FEE_ASSIGNMENTS ────────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'fee_assignments') THEN
    ALTER TABLE public.fee_assignments ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.fee_assignments ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.fee_assignments ADD COLUMN IF NOT EXISTS updated_by  UUID;
  END IF;

  -- ─── FEE_PAYMENTS ───────────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'fee_payments') THEN
    ALTER TABLE public.fee_payments ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.fee_payments ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.fee_payments ADD COLUMN IF NOT EXISTS updated_by  UUID;
  END IF;

  -- ─── EXAMS ──────────────────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'exams') THEN
    ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS updated_by  UUID;
  END IF;

  -- ─── EXAM_RESULTS ───────────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'exam_results') THEN
    ALTER TABLE public.exam_results ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.exam_results ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.exam_results ADD COLUMN IF NOT EXISTS updated_by  UUID;
  END IF;

  -- ─── HOMEWORK_ASSIGNMENTS ───────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'homework_assignments') THEN
    ALTER TABLE public.homework_assignments ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.homework_assignments ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.homework_assignments ADD COLUMN IF NOT EXISTS updated_by  UUID;
  END IF;

  -- ─── TIMETABLE_SLOTS ────────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'timetable_slots') THEN
    ALTER TABLE public.timetable_slots ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;
    ALTER TABLE public.timetable_slots ADD COLUMN IF NOT EXISTS created_by  UUID;
    ALTER TABLE public.timetable_slots ADD COLUMN IF NOT EXISTS updated_by  UUID;
  END IF;

END $$;

