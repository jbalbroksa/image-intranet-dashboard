
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteProductDialog } from './DeleteProductDialog';
import { EditProductDialog } from './EditProductDialog';
import { Product } from '@/types';

interface ProductActionsProps {
  product: Product;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  onEditSuccess: () => void;
  onDelete: () => void;
}

export function ProductActions({ 
  product, 
  isEditDialogOpen, 
  setIsEditDialogOpen, 
  onEditSuccess, 
  onDelete 
}: ProductActionsProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 mt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <EditProductDialog 
          product={product}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={onEditSuccess}
        />
        
        <DeleteProductDialog onDelete={onDelete} />
        
        <Button variant="outline" asChild>
          <Link to="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>
    </div>
  );
}
