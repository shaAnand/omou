
-- Add onboarding columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN selected_categories TEXT[];

-- Create sample thoughts data
INSERT INTO public.flashcards (user_id, content) VALUES 
-- Stoicism samples (using a placeholder UUID that will be replaced)
('00000000-0000-0000-0000-000000000001', 'You have power over your mind - not outside events. Realize this, and you will find strength. - Marcus Aurelius'),
('00000000-0000-0000-0000-000000000001', 'The happiness of your life depends upon the quality of your thoughts.'),
('00000000-0000-0000-0000-000000000001', 'When we are no longer able to change a situation, we are challenged to change ourselves.'),

-- Motivation samples
('00000000-0000-0000-0000-000000000002', 'The only way to do great work is to love what you do. - Steve Jobs'),
('00000000-0000-0000-0000-000000000002', 'Success is not final, failure is not fatal: it is the courage to continue that counts.'),
('00000000-0000-0000-0000-000000000002', 'Your limitation—it''s only your imagination.'),

-- Wisdom samples
('00000000-0000-0000-0000-000000000003', 'The only true wisdom is in knowing you know nothing. - Socrates'),
('00000000-0000-0000-0000-000000000003', 'Yesterday is history, tomorrow is a mystery, today is a gift.'),
('00000000-0000-0000-0000-000000000003', 'In the middle of difficulty lies opportunity. - Albert Einstein'),

-- Mindfulness samples
('00000000-0000-0000-0000-000000000004', 'The present moment is the only time over which we have dominion. - Thích Nhất Hạnh'),
('00000000-0000-0000-0000-000000000004', 'Wherever you are, be there totally. - Eckhart Tolle'),
('00000000-0000-0000-0000-000000000004', 'Peace comes from within. Do not seek it without. - Buddha'),

-- Health samples
('00000000-0000-0000-0000-000000000005', 'Take care of your body. It''s the only place you have to live. - Jim Rohn'),
('00000000-0000-0000-0000-000000000005', 'Health is not about the weight you lose, but about the life you gain.'),
('00000000-0000-0000-0000-000000000005', 'A healthy outside starts from the inside.'),

-- Spirituality samples
('00000000-0000-0000-0000-000000000006', 'The soul becomes dyed with the color of its thoughts. - Marcus Aurelius'),
('00000000-0000-0000-0000-000000000006', 'Be yourself; everyone else is already taken. - Oscar Wilde'),
('00000000-0000-0000-0000-000000000006', 'The journey of a thousand miles begins with one step. - Lao Tzu');

-- Create a function to get sample thoughts by category
CREATE OR REPLACE FUNCTION public.get_sample_thoughts(category_name TEXT)
RETURNS TABLE (
  content TEXT
) AS $$
BEGIN
  CASE category_name
    WHEN 'Stoicism' THEN
      RETURN QUERY SELECT fc.content FROM public.flashcards fc WHERE fc.user_id = '00000000-0000-0000-0000-000000000001';
    WHEN 'Motivation' THEN
      RETURN QUERY SELECT fc.content FROM public.flashcards fc WHERE fc.user_id = '00000000-0000-0000-0000-000000000002';
    WHEN 'Wisdom' THEN
      RETURN QUERY SELECT fc.content FROM public.flashcards fc WHERE fc.user_id = '00000000-0000-0000-0000-000000000003';
    WHEN 'Mindfulness' THEN
      RETURN QUERY SELECT fc.content FROM public.flashcards fc WHERE fc.user_id = '00000000-0000-0000-0000-000000000004';
    WHEN 'Health' THEN
      RETURN QUERY SELECT fc.content FROM public.flashcards fc WHERE fc.user_id = '00000000-0000-0000-0000-000000000005';
    WHEN 'Spirituality' THEN
      RETURN QUERY SELECT fc.content FROM public.flashcards fc WHERE fc.user_id = '00000000-0000-0000-0000-000000000006';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
