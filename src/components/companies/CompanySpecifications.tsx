
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company, CompanySpecification } from '@/types';
import { EditSpecificationForm } from './forms/EditSpecificationForm';
import { AlertTriangle, Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompanies } from '@/hooks/use-companies';
import { useToast } from '@/hooks/use-toast';

interface CompanySpecificationsProps {
  company: Company;
}

export function CompanySpecifications({ company }: CompanySpecificationsProps) {
  const [newCategory, setNewCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { updateCompany, deleteSpecification, isLoading } = useCompanies();
  const { toast } = useToast();

  const handleAddSpecification = () => {
    if (!newCategory.trim()) return;
    
    // Create a new specification without an ID
    const newSpec = {
      category: newCategory.trim(),
      content: '',
    };
    
    updateCompany({
      id: company.id,
      specifications: [newSpec]
    });
    
    setNewCategory('');
    setIsDialogOpen(false);
    
    toast({
      title: "Especificación añadida",
      description: `La especificación "${newCategory}" ha sido añadida correctamente.`,
    });
  };
  
  const handleDeleteSpecification = (specId: string) => {
    deleteSpecification(specId);
    
    toast({
      title: "Especificación eliminada",
      description: "La especificación ha sido eliminada correctamente.",
    });
  };
  
  const specificationsByCategory = company.specifications?.reduce((acc: Record<string, CompanySpecification>, spec) => {
    acc[spec.category] = spec;
    return acc;
  }, {}) || {};
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Especificaciones de la Compañía</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Especificación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Especificación</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="category">Categoría de Especificación</Label>
              <Input 
                id="category" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ej: Requisitos, Coberturas, Exclusiones..."
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddSpecification} 
                disabled={!newCategory.trim() || isLoading}
              >
                Añadir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {company.specifications?.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <h4 className="text-base font-medium mb-2">No hay especificaciones</h4>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Esta compañía no tiene especificaciones definidas. Haga clic en el botón "Añadir Especificación" para crear la primera.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(specificationsByCategory).map(([category, spec]) => (
            <Card key={spec.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{category}</CardTitle>
                <CardDescription>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs text-destructive"
                    onClick={() => handleDeleteSpecification(spec.id)}
                  >
                    Eliminar
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditSpecificationForm 
                  specification={spec} 
                  companyId={company.id}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
