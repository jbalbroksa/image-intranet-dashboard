
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCompanies } from '@/hooks/use-companies';
import { CompanySpecification } from '@/types';
import { Pencil, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditSpecificationFormProps {
  specification: CompanySpecification;
  companyId: string;
  onSuccess?: () => void;
}

export function EditSpecificationForm({ 
  specification,
  companyId,
  onSuccess
}: EditSpecificationFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(specification.content);
  const { updateCompany, isLoading } = useCompanies();
  const { toast } = useToast();
  
  const handleSave = () => {
    const updatedSpec = {
      ...specification,
      content
    };
    
    updateCompany({
      id: companyId,
      specifications: [updatedSpec]
    });
    
    setIsEditing(false);
    toast({
      title: "Especificación actualizada",
      description: `La especificación "${specification.category}" ha sido actualizada correctamente`,
    });
    
    if (onSuccess) onSuccess();
  };
  
  const handleCancel = () => {
    setContent(specification.content);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <div className="space-y-3 py-3">
        <Textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ingrese el contenido de esta especificación..."
          className="min-h-[100px] resize-y"
        />
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            size="sm" 
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-1" />
            Guardar
          </Button>
          <Button 
            onClick={handleCancel} 
            size="sm" 
            variant="outline"
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-3">
      {specification.content ? (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{specification.content}</p>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No hay especificaciones para esta categoría. Haga clic en "Editar" para añadir contenido.
        </p>
      )}
      <Button 
        onClick={() => setIsEditing(true)} 
        size="sm" 
        variant="ghost" 
        className="mt-2"
      >
        <Pencil className="h-4 w-4 mr-1" />
        Editar
      </Button>
    </div>
  );
}
