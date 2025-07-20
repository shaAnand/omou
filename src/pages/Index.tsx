
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { UserAvatar } from '@/components/UserAvatar';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { flashcards, loading: flashcardsLoading, createFlashcard, updateFlashcard, deleteFlashcard } = useFlashcards();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    <div className="min-h-screen bg-background">
      {/* Clean header with generous whitespace */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="content-container">
          <div className="flex items-center justify-between py-4">
            <h1 className="heading-primary">Omou</h1>
            <UserAvatar onSignOut={handleSignOut} />
          </div>
        </div>
      </header>
      
      {/* Main content with proper spacing */}
      <main className="content-container">
        <FlashcardDeck 
          flashcards={flashcards}
          onCreateFlashcard={createFlashcard}
          onUpdateFlashcard={updateFlashcard}
          onDeleteFlashcard={deleteFlashcard}
        />
      </main>
    </div>
  );
};

export default Index;
