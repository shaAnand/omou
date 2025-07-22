
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryData } from '@/hooks/useCategoriesMatrix';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CategoriesMatrixProps {
  categories: CategoryData[];
  loading: boolean;
  onCategorySelect: (categoryName: string) => void;
  onAddCategories?: () => void;
  onDeleteCategory?: (categoryName: string) => void;
}

export const CategoriesMatrix = ({ 
  categories, 
  loading, 
  onCategorySelect, 
  onAddCategories,
  onDeleteCategory 
}: CategoriesMatrixProps) => {
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
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-lg font-semibold mb-2">No categories selected</h3>
        <p className="text-muted-foreground mb-6">
          Select categories to organize your thoughts and get sample content to get started.
        </p>
        {onAddCategories && (
          <Button onClick={onAddCategories} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Categories
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card 
          key={category.name} 
          className="group relative"
        >
          {/* Delete button */}
          {onDeleteCategory && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the "{category.name}" category? 
                    This will also delete all {category.thoughtCount} thoughts in this category. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteCategory(category.name)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <div 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
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
          </div>
        </Card>
      ))}
      
      {/* Add Categories card when categories exist */}
      {onAddCategories && (
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group border-dashed"
          onClick={onAddCategories}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[180px] text-center">
            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
            <h3 className="font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Add More Categories
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Explore new topics
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
