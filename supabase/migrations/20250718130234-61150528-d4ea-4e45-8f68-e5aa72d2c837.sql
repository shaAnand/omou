-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own flashcards" 
ON public.flashcards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flashcards" 
ON public.flashcards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards" 
ON public.flashcards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards" 
ON public.flashcards 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_flashcards_updated_at
BEFORE UPDATE ON public.flashcards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for flashcard images
INSERT INTO storage.buckets (id, name, public) VALUES ('flashcard-images', 'flashcard-images', true);

-- Create policies for image uploads
CREATE POLICY "Users can view flashcard images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'flashcard-images');

CREATE POLICY "Users can upload their own flashcard images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'flashcard-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own flashcard images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'flashcard-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own flashcard images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'flashcard-images' AND auth.uid()::text = (storage.foldername(name))[1]);