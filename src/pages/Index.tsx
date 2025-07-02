import { FlashcardDeck } from '@/components/FlashcardDeck';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Flashcard } from '@/types/flashcard';

const Index = () => {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', []);

  const handleUpdateFlashcards = (updatedFlashcards: Flashcard[]) => {
    setFlashcards(updatedFlashcards);
  };

  return (
    <FlashcardDeck 
      flashcards={flashcards}
      onUpdateFlashcards={handleUpdateFlashcards}
    />
  );
};

export default Index;
