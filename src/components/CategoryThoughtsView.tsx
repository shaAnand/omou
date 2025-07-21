import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import { CategoryThoughtCard } from './CategoryThoughtCard';
import { useCategoryThoughts } from '@/hooks/useCategoryThoughts';

interface CategoryThoughtsViewProps {
  category: string;
  onBack: () => void;
  onCreateThought?: () => void;
  onEditThought?: (thought: any) => void;
}

export const CategoryThoughtsView = ({ 
  category, 
  onBack, 
  onCreateThought,
  onEditThought 
}: CategoryThoughtsViewProps) => {
  const {
    thoughts,
    sampleThoughts,
    loading,
    searchQuery,
    setSearchQuery,
    deleteThought
  } = useCategoryThoughts(category);

  const categoryEmojis: Record<string, string> = {
    'Stoicism': '🏛️',
    'Motivation': '🚀',
    'Wisdom': '🦉',
    'Mindfulness': '🧘',
    'Health': '💪',
    'Spirituality': '✨'
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{categoryEmojis[category] || '💭'}</span>
            <h1 className="text-2xl font-bold">{category}</h1>
          </div>
        </div>
        
        {onCreateThought && (
          <Button onClick={onCreateThought} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Thought
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search thoughts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{thoughts.length} personal thoughts</span>
        <span>{sampleThoughts.length} sample thoughts</span>
      </div>

      {/* Personal Thoughts */}
      {thoughts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Thoughts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {thoughts.map((thought) => (
              <CategoryThoughtCard
                key={thought.id}
                thought={thought}
                onDelete={deleteThought}
                onEdit={onEditThought}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sample Thoughts */}
      {sampleThoughts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sample Thoughts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleThoughts.map((content, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {thoughts.length === 0 && sampleThoughts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{categoryEmojis[category] || '💭'}</div>
          <h3 className="text-lg font-semibold mb-2">No thoughts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 
              'No thoughts match your search query.' : 
              'Start adding your first thought to this category.'
            }
          </p>
          {onCreateThought && !searchQuery && (
            <Button onClick={onCreateThought}>Add Your First Thought</Button>
          )}
        </div>
      )}
    </div>
  );
};