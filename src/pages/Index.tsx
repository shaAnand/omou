import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { Flashcard } from '@/types/flashcard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', []);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleUpdateFlashcards = (updatedFlashcards: Flashcard[]) => {
    setFlashcards(updatedFlashcards);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" onClick={handleSignOut} size="sm">
          Sign Out
        </Button>
      </div>
      <FlashcardDeck 
        flashcards={flashcards}
        onUpdateFlashcards={handleUpdateFlashcards}
      />
    </div>
  );
};

export default Index;
