import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function FlashcardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-sm mx-auto">
        {/* Flashcard skeleton */}
        <div className="relative w-full mb-6">
          <Card className="w-full min-h-96 p-8 bg-white shadow-lg border border-gray-200">
            <div className="flex flex-col h-full min-h-80">
              {/* Image skeleton */}
              <div className="mb-6 flex-shrink-0">
                <Skeleton className="w-full h-48 rounded-lg" />
              </div>
              
              {/* Content skeleton */}
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full space-y-3">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-6 w-1/2 mx-auto" />
                  <Skeleton className="h-6 w-2/3 mx-auto" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls skeleton */}
        <div className="flex items-center justify-center space-x-6">
          <Skeleton className="h-12 w-20 rounded-lg" />
          <Skeleton className="h-12 w-24 rounded-lg" />
        </div>

        {/* Navigation indicators skeleton */}
        <div className="flex justify-between items-center mt-6 px-8">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function FlashcardDeckSkeleton() {
  return (
    <div className="relative min-h-screen bg-gradient-subtle">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Skeleton className="h-6 w-20" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
        
        {/* Progress bar skeleton */}
        <Skeleton className="h-1 w-full" />
      </div>

      {/* Main content skeleton */}
      <div className="pt-20">
        <FlashcardSkeleton />
      </div>

      {/* Navigation controls skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-t">
        <div className="flex items-center justify-center p-4 space-x-4">
          <Skeleton className="h-12 w-24 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-12 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function EmptyStateSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-subtle">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        
        <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
      </div>
    </div>
  );
}