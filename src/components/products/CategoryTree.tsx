
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Edit, Trash2, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCategory } from '@/types';

interface CategoryTreeProps {
  categories: ProductCategory[];
  onEditCategory: (category: ProductCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onCreateCategory: () => void;
}

export function CategoryTree({ 
  categories, 
  onEditCategory, 
  onDeleteCategory,
  onCreateCategory
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Toggle expanded state of category
  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Render a single category and its subcategories recursively
  const renderCategory = (category: ProductCategory, depth = 0) => {
    const isExpanded = expandedCategories[category.id] || false;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    
    return (
      <div key={category.id} className="mb-1">
        <div 
          className={`
            flex items-center justify-between p-2 rounded-md
            ${depth === 0 ? 'bg-muted/50' : 'bg-background'}
            ${depth > 0 ? 'ml-' + (depth * 4) : ''}
            hover:bg-muted/70 transition-colors
          `}
        >
          <div className="flex items-center gap-2">
            {hasSubcategories ? (
              <button
                onClick={() => toggleCategoryExpanded(category.id)}
                className="p-1 rounded hover:bg-muted"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <span className="font-medium text-sm">
              {category.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEditCategory(category)}
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDeleteCategory(category.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        
        {hasSubcategories && isExpanded && (
          <div className="mt-1">
            {category.subcategories?.map(subcategory => 
              renderCategory(subcategory, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <FolderTree className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No hay categorías</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No se han creado categorías aún. Crea la primera categoría para organizar tus productos.
        </p>
        <Button 
          className="mt-4" 
          onClick={onCreateCategory}
        >
          Crear Categoría
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-muted/30">
        {categories.map(category => renderCategory(category))}
      </div>
    </div>
  );
}
