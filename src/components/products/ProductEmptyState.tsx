
import { FileText, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductEmptyStateProps {
  title: string;
  description: string;
  onEdit: () => void;
  icon?: React.ReactNode;
}

export function ProductEmptyState({ title, description, onEdit, icon }: ProductEmptyStateProps) {
  return (
    <div className="py-12 text-center border border-dashed rounded-lg">
      {icon || <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-4">
        {description}
      </p>
      <Button onClick={onEdit}>
        <Pencil className="mr-2 h-4 w-4" />
        {title && title.startsWith('No hay') ? `Añadir ${title.substring(7)}` : 'Editar'}
      </Button>
    </div>
  );
}
