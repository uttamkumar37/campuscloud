-- Subscription Plans: plan templates (FREE, BASIC, PRO, ENTERPRISE)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id              UUID         PRIMARY KEY,
    name            VARCHAR(50)  NOT NULL UNIQUE,
    price           NUMERIC(10,2) NOT NULL DEFAULT 0,
    billing_cycle_days INTEGER   NOT NULL DEFAULT 30,
    max_students    INTEGER      NOT NULL DEFAULT 50,
    max_teachers    INTEGER      NOT NULL DEFAULT 5,
    description     TEXT,
    active          BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL
);

-- Features included in each plan (normalised)
CREATE TABLE IF NOT EXISTS public.subscription_plan_features (
    plan_id  UUID        NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
    feature  VARCHAR(50) NOT NULL,
    PRIMARY KEY (plan_id, feature)
);

-- Active subscription per tenant
CREATE TABLE IF NOT EXISTS public.tenant_subscriptions (
    id              UUID        PRIMARY KEY,
    tenant_id       VARCHAR(50) NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
    plan_id         UUID        NOT NULL REFERENCES public.subscription_plans(id),
    start_date      DATE        NOT NULL,
    end_date        DATE        NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    payment_status  VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_tenant_id ON public.tenant_subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_status    ON public.tenant_subscriptions(status);

-- Platform payment records (for SaaS subscription fees)
CREATE TABLE IF NOT EXISTS public.platform_payments (
    id              UUID          PRIMARY KEY,
    tenant_id       VARCHAR(50)   NOT NULL,
    subscription_id UUID          REFERENCES public.tenant_subscriptions(id),
    amount          NUMERIC(10,2) NOT NULL,
    status          VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    payment_date    DATE,
    payment_method  VARCHAR(30),
    reference_no    VARCHAR(100),
    notes           TEXT,
    created_at      TIMESTAMPTZ   NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_platform_payments_tenant_id ON public.platform_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_platform_payments_status    ON public.platform_payments(status);

-- Seed default plans
INSERT INTO public.subscription_plans (id, name, price, billing_cycle_days, max_students, max_teachers, description, active, created_at)
VALUES
  (gen_random_uuid(), 'FREE',       0,     30,  50,    5,   'Free plan for small institutions — limited to core features.', TRUE, NOW()),
  (gen_random_uuid(), 'BASIC',    2999,    30,  300,  30,   'For growing schools — includes academics, fees, and bulk upload.', TRUE, NOW()),
  (gen_random_uuid(), 'PRO',      7999,    30, 1500, 150,   'Full-featured plan for large schools with all modules.', TRUE, NOW()),
  (gen_random_uuid(), 'ENTERPRISE', 0,     30,   -1,  -1,   'Custom enterprise plan — unlimited seats and dedicated support.', TRUE, NOW())
ON CONFLICT (name) DO NOTHING;

-- Seed FREE plan features
INSERT INTO public.subscription_plan_features (plan_id, feature)
SELECT id, unnest(ARRAY['STUDENT_MANAGEMENT','ATTENDANCE_TRACKING','DASHBOARD_ACCESS'])
FROM public.subscription_plans WHERE name = 'FREE'
ON CONFLICT DO NOTHING;

-- Seed BASIC plan features
INSERT INTO public.subscription_plan_features (plan_id, feature)
SELECT id, unnest(ARRAY[
  'STUDENT_MANAGEMENT','TEACHER_MANAGEMENT','ACADEMIC_MANAGEMENT',
  'ATTENDANCE_TRACKING','FEE_MANAGEMENT','EXAM_MANAGEMENT',
  'BULK_UPLOAD','DASHBOARD_ACCESS'
])
FROM public.subscription_plans WHERE name = 'BASIC'
ON CONFLICT DO NOTHING;

-- Seed PRO plan features
INSERT INTO public.subscription_plan_features (plan_id, feature)
SELECT id, unnest(ARRAY[
  'STUDENT_MANAGEMENT','TEACHER_MANAGEMENT','ACADEMIC_MANAGEMENT',
  'ATTENDANCE_TRACKING','FEE_MANAGEMENT','EXAM_MANAGEMENT',
  'HOMEWORK_MANAGEMENT','TIMETABLE_MANAGEMENT','PARENT_PORTAL',
  'BULK_UPLOAD','DASHBOARD_ACCESS','ADVANCED_REPORTS'
])
FROM public.subscription_plans WHERE name = 'PRO'
ON CONFLICT DO NOTHING;

-- Seed ENTERPRISE plan features (all features)
INSERT INTO public.subscription_plan_features (plan_id, feature)
SELECT id, unnest(ARRAY[
  'STUDENT_MANAGEMENT','TEACHER_MANAGEMENT','ACADEMIC_MANAGEMENT',
  'ATTENDANCE_TRACKING','FEE_MANAGEMENT','EXAM_MANAGEMENT',
  'HOMEWORK_MANAGEMENT','TIMETABLE_MANAGEMENT','PARENT_PORTAL',
  'BULK_UPLOAD','DASHBOARD_ACCESS','ADVANCED_REPORTS','CUSTOM_BRANDING'
])
FROM public.subscription_plans WHERE name = 'ENTERPRISE'
ON CONFLICT DO NOTHING;
