
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateUserForm } from './CreateUserForm';
import { useToast } from '@/hooks/use-toast';

interface UsersHeaderProps {
  onUserCreated: () => void;
}

export function UsersHeader({ onUserCreated }: UsersHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSuccess = () => {
    console.log('User created successfully, closing dialog');
    setIsCreateDialogOpen(false);
    onUserCreated();
    toast({
      title: "Usuario creado",
      description: "El usuario ha sido creado exitosamente",
    });
  };
  
  const handleCancel = () => {
    console.log('User creation cancelled, closing dialog');
    setIsCreateDialogOpen(false);
    toast({
      description: "Operación cancelada",
    });
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">Administra los usuarios del sistema</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
              <DialogDescription>
                Añade un nuevo usuario al sistema. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <CreateUserForm 
              onSuccess={handleSuccess} 
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
