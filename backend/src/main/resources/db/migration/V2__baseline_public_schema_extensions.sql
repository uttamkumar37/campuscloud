ALTER TABLE public.tenants
    ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS primary_color VARCHAR(20) NOT NULL DEFAULT '#10b981';

UPDATE public.tenants
SET primary_color = '#10b981'
WHERE primary_color IS NULL OR primary_color = '';
