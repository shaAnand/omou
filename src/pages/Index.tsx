import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { flashcards, loading: flashcardsLoading, createFlashcard, updateFlashcard, deleteFlashcard } = useFlashcards();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);


  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || flashcardsLoading) {
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
        onCreateFlashcard={createFlashcard}
        onUpdateFlashcard={updateFlashcard}
        onDeleteFlashcard={deleteFlashcard}
      />
    </div>
  );
};

export default Index;
