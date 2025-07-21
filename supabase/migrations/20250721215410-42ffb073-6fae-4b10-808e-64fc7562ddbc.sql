
-- Add category column to flashcards table
ALTER TABLE public.flashcards 
ADD COLUMN category TEXT;

-- Add an index for better query performance when filtering by category
CREATE INDEX idx_flashcards_category ON public.flashcards(category);

-- Update the updated_at trigger to work with the new column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists on flashcards table
DROP TRIGGER IF EXISTS update_flashcards_updated_at ON public.flashcards;
CREATE TRIGGER update_flashcards_updated_at
    BEFORE UPDATE ON public.flashcards
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
