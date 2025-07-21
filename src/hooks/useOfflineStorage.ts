
import { useState, useEffect } from 'react';
import { Flashcard } from '@/types/flashcard';

const OFFLINE_STORAGE_KEY = 'omou-offline-flashcards';

export function useOfflineStorage() {
  const [offlineFlashcards, setOfflineFlashcards] = useState<Flashcard[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Load cached flashcards from localStorage
    const loadOfflineFlashcards = () => {
      try {
        const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setOfflineFlashcards(parsed.map((card: any) => ({
            ...card,
            createdAt: new Date(card.createdAt),
            updatedAt: new Date(card.updatedAt)
          })));
        }
      } catch (error) {
        console.error('Error loading offline flashcards:', error);
      }
    };

    loadOfflineFlashcards();

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheFlashcards = (flashcards: Flashcard[]) => {
    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(flashcards));
      setOfflineFlashcards(flashcards);
    } catch (error) {
      console.error('Error caching flashcards:', error);
    }
  };

  const clearOfflineCache = () => {
    try {
      localStorage.removeItem(OFFLINE_STORAGE_KEY);
      setOfflineFlashcards([]);
    } catch (error) {
      console.error('Error clearing offline cache:', error);
    }
  };

  return {
    offlineFlashcards,
    isOffline,
    cacheFlashcards,
    clearOfflineCache
  };
}
