ALTER TABLE public.tenants
    ADD COLUMN IF NOT EXISTS slug VARCHAR(80);

UPDATE public.tenants
SET slug = lower(regexp_replace(coalesce(nullif(tenant_id, ''), school_name), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

UPDATE public.tenants
SET slug = trim(both '-' from slug)
WHERE slug IS NOT NULL;

ALTER TABLE public.tenants
    ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants (slug);