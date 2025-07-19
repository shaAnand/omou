export interface Flashcard {
  id: string;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
}