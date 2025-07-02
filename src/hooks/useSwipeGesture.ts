import { useState, useRef, useCallback } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50
}: SwipeGestureOptions) {
  const [isAnimating, setIsAnimating] = useState(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    currentXRef.current = touch.clientX;
    isDraggingRef.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    const touch = e.touches[0];
    currentXRef.current = touch.clientX;
    
    // Prevent vertical scrolling while swiping horizontally
    const deltaX = Math.abs(touch.clientX - startXRef.current);
    const deltaY = Math.abs(touch.clientY - startYRef.current);
    
    if (deltaX > deltaY) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    const deltaX = currentXRef.current - startXRef.current;
    const deltaY = Math.abs(startYRef.current - currentXRef.current);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
      setIsAnimating(true);
      
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
      
      // Reset animation state after animation completes
      setTimeout(() => setIsAnimating(false), 300);
    }
    
    isDraggingRef.current = false;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };

  return { swipeHandlers, isAnimating };
}