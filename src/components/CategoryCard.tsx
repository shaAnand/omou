
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface CategoryCardProps {
  category: Category;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  alreadyOwned?: boolean;
}

export const CategoryCard = ({ 
  category, 
  selected, 
  onToggle, 
  disabled = false,
  alreadyOwned = false 
}: CategoryCardProps) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        selected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent/50",
        disabled && "opacity-60 cursor-not-allowed",
        alreadyOwned && "border-green-500 bg-green-50"
      )}
      onClick={disabled ? undefined : onToggle}
    >
      <CardContent className="p-4 text-center space-y-2">
        <div className="text-2xl">{category.icon}</div>
        <div className="font-medium">{category.name}</div>
        <div className="text-sm text-muted-foreground">{category.description}</div>
        {alreadyOwned ? (
          <div className="text-green-600 text-sm font-medium">✓ Already Added</div>
        ) : selected ? (
          <div className="text-primary text-sm font-medium">✓ Selected</div>
        ) : null}
      </CardContent>
    </Card>
  );
};
