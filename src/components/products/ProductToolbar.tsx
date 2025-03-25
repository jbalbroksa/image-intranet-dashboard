
import { ProductSearch } from './ProductSearch';
import { ProductFilters } from './ProductFilters';
import { ProductSorter } from './ProductSorter';
import { ProductCategory } from '@/types';

interface ProductToolbarProps {
  searchTerm: string;
  selectedCategory: string | null;
  selectedStatus: string | null;
  productCategories?: ProductCategory[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onStatusChange: (status: string | null) => void;
}

export function ProductToolbar({
  searchTerm,
  selectedCategory,
  selectedStatus,
  productCategories,
  onSearchChange,
  onCategoryChange,
  onStatusChange
}: ProductToolbarProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <ProductSearch 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
      />
      <div className="flex items-center gap-2">
        <ProductFilters
          productCategories={productCategories}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          onCategoryChange={onCategoryChange}
          onStatusChange={onStatusChange}
        />
        <ProductSorter />
      </div>
    </div>
  );
}
