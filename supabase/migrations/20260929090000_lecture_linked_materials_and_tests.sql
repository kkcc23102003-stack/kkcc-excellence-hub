-- KKCC lecture-linked study packs + optional paid notes
-- Run this after the previous KKCC migrations. It is additive and non-destructive.

ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS lecture_id uuid REFERENCES public.lectures(id) ON DELETE SET NULL;

ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS access_type text NOT NULL DEFAULT 'course';

ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS price integer NOT NULL DEFAULT 0;

ALTER TABLE public.tests
  ADD COLUMN IF NOT EXISTS lecture_id uuid REFERENCES public.lectures(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'materials_access_type_check'
      AND conrelid = 'public.materials'::regclass
  ) THEN
    ALTER TABLE public.materials
      ADD CONSTRAINT materials_access_type_check
      CHECK (access_type IN ('course', 'free', 'paid'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'materials_price_check'
      AND conrelid = 'public.materials'::regclass
  ) THEN
    ALTER TABLE public.materials
      ADD CONSTRAINT materials_price_check
      CHECK (price >= 0);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_materials_lecture ON public.materials(lecture_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_materials_access_type ON public.materials(access_type, price);
CREATE INDEX IF NOT EXISTS idx_tests_lecture ON public.tests(lecture_id, sort_order);

COMMENT ON COLUMN public.materials.lecture_id IS 'Optional lecture this note/PDF/resource is attached to.';
COMMENT ON COLUMN public.materials.access_type IS 'course = included with course access, free = open/free note, paid = standalone paid note.';
COMMENT ON COLUMN public.materials.price IS 'Standalone material price in INR paise-free whole rupees for KKCC admin UI.';
COMMENT ON COLUMN public.tests.lecture_id IS 'Optional lecture this test/practice set is attached to.';
