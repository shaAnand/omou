
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoriesMatrix } from '@/components/CategoriesMatrix';
import { CategoryThoughtsView } from '@/components/CategoryThoughtsView';
import { CategorySelectionModal } from '@/components/CategorySelectionModal';
import { UserAvatar } from '@/components/UserAvatar';
import { useCategoriesMatrix } from '@/hooks/useCategoriesMatrix';
import { useCategoryManagement } from '@/hooks/useCategoryManagement';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';

const Categories = () => {
  const {
    categories,
    loading,
    selectedCategory,
    selectCategory,
    goBackToMatrix,
    refetch
  } = useCategoriesMatrix();
  
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { mergeUserCategories, removeUserCategory, loading: categoryUpdateLoading } = useCategoryManagement();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [showCategorySelection, setShowCategorySelection] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAddCategories = () => {
    setShowCategorySelection(true);
  };

  const handleCategorySelectionComplete = async (selectedCategories: string[]) => {
    const existingCategories = profile?.selected_categories || [];
    const success = await mergeUserCategories(selectedCategories, existingCategories);
    
    if (success) {
      setShowCategorySelection(false);
      // Refresh the categories data to show the new categories
      await refetch();
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    const existingCategories = profile?.selected_categories || [];
    const success = await removeUserCategory(categoryName, existingCategories);
    
    if (success) {
      // Refresh the categories data to show remaining categories
      await refetch();
    }
  };

  if (authLoading || profileLoading) {
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
    return null;
  }

  // If user hasn't completed onboarding, redirect to main page
  if (profile && !profile.onboarding_completed) {
    navigate('/');
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed User Avatar */}
      <div className={`fixed z-20 ${isMobile ? 'top-4 left-4' : 'top-6 left-6'}`}>
        <UserAvatar onSignOut={handleSignOut} />
      </div>
      
      <div className={`${isMobile ? 'px-4 pt-16 pb-8' : 'px-8 pt-20 pb-12'}`}>
        <div className="max-w-7xl mx-auto">
          {selectedCategory ? (
            <CategoryThoughtsView
              category={selectedCategory}
              onBack={goBackToMatrix}
            />
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Your Categories</h1>
                <p className="text-muted-foreground">
                  Explore and manage your thoughts organized by category
                </p>
              </div>
              
              <CategoriesMatrix
                categories={categories}
                loading={loading || categoryUpdateLoading}
                onCategorySelect={selectCategory}
                onAddCategories={handleAddCategories}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>
          )}
        </div>
      </div>

      <CategorySelectionModal
        open={showCategorySelection}
        onOpenChange={setShowCategorySelection}
        onComplete={handleCategorySelectionComplete}
        initialSelectedCategories={profile?.selected_categories || []}
        mode="add"
      />
    </div>
  );
};

export default Categories;
