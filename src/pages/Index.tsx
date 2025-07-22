
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { UserAvatar } from '@/components/UserAvatar';
import { OnboardingModal } from '@/components/OnboardingModal';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { flashcards, loading: flashcardsLoading, createFlashcard, updateFlashcard, deleteFlashcard, refetchFlashcards } = useFlashcards();
  const { user, loading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
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

  const handleOnboardingComplete = async (selectedCategories?: string[]) => {
    // Refresh flashcards after onboarding
    await refetchFlashcards();
    
    // Navigate based on whether categories were selected
    if (selectedCategories && selectedCategories.length > 0) {
      // If categories were selected, go to categories page
      navigate('/categories');
    } else {
      // If no categories selected (skip), stay on main page to create thoughts
      // No navigation needed as user is already on the main page
    }
  };

  const showOnboarding = user && profile && !profile.onboarding_completed;

  if (loading || profileLoading) {
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
    <div className="relative min-h-screen">
      {/* Fixed User Avatar - Always visible on left side */}
      <div className={`fixed z-20 ${isMobile ? 'top-4 left-4' : 'top-6 left-6'}`}>
        <UserAvatar onSignOut={handleSignOut} />
      </div>
      
      <div className={`${isMobile ? 'px-4 pt-16' : 'px-8 pt-20'}`}>
        <FlashcardDeck 
          flashcards={flashcards}
          loading={flashcardsLoading}
          onCreateFlashcard={createFlashcard}
          onUpdateFlashcard={updateFlashcard}
          onDeleteFlashcard={deleteFlashcard}
        />
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal 
          open={true} 
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
};

export default Index;
