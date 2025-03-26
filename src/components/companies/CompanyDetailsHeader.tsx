
import { Link } from 'react-router-dom';
import { Building2, ChevronLeft, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { EditCompanyForm } from './forms/EditCompanyForm';
import { Company } from '@/types';

interface CompanyDetailsHeaderProps {
  company: Company;
  onEdit: () => void;
  onDelete: () => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}

export function CompanyDetailsHeader({ 
  company, 
  onEdit, 
  onDelete, 
  isEditDialogOpen, 
  setIsEditDialogOpen 
}: CompanyDetailsHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {company.logo ? (
          <img 
            src={company.logo} 
            alt={company.name} 
            className="h-16 w-16 object-contain bg-white p-1 rounded-md border"
          />
        ) : (
          <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-md">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{company.name}</h1>
            <Badge variant={company.classification === 'Preferente' ? 'default' : 'outline'}>
              {company.classification}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {company.website && (
              <a 
                href={`https://${company.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {company.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Editar Compañía</DialogTitle>
              <DialogDescription>
                Actualice los datos de la compañía.
              </DialogDescription>
            </DialogHeader>
            <EditCompanyForm 
              company={company} 
              onSuccess={onEdit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro de eliminar esta compañía?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente esta compañía y toda su información asociada.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button variant="outline" asChild>
          <Link to="/companies">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>
    </div>
  );
}
