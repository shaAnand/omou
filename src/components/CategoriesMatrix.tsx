import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryData } from '@/hooks/useCategoriesMatrix';
import { formatDistanceToNow } from 'date-fns';

interface CategoriesMatrixProps {
  categories: CategoryData[];
  loading: boolean;
  onCategorySelect: (categoryName: string) => void;
}

export const CategoriesMatrix = ({ categories, loading, onCategorySelect }: CategoriesMatrixProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤔</div>
        <h3 className="text-lg font-semibold mb-2">No categories selected</h3>
        <p className="text-muted-foreground">
          Complete your onboarding to select categories and start organizing your thoughts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card 
          key={category.name} 
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
          onClick={() => onCategorySelect(category.name)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {category.emoji}
              </span>
              <span className="text-lg">{category.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Thoughts</span>
                <span className="font-semibold">{category.thoughtCount}</span>
              </div>
              {category.lastUpdated && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last updated</span>
                  <span className="text-sm">
                    {formatDistanceToNow(category.lastUpdated, { addSuffix: true })}
                  </span>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                View Thoughts
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};