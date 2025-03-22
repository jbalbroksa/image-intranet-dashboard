
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// User types
const USER_TYPES = [
  'Administrador',
  'Responsable de Departamento',
  'Delegación',
  'Empleado SSCC',
  'Colaborador'
];

interface CreateUserFormProps {
  onSuccess: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const { toast } = useToast();
  
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Usuario creado',
      description: 'El usuario ha sido creado correctamente',
    });
    onSuccess();
  };
  
  const renderUserTypeOption = (type: string) => (
    <SelectItem key={type} value={type}>
      {type}
    </SelectItem>
  );
  
  return (
    <form onSubmit={handleCreateUser}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo *</Label>
            <Input id="name" placeholder="Nombre y apellidos" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="correo@ejemplo.com" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Usuario *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPES.map(renderUserTypeOption)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="branch">Sucursal *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branch-1">Servicios Centrales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Cargo</Label>
            <Input id="position" placeholder="Ej: Director de Departamento" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="extension">Extensión</Label>
            <Input id="extension" placeholder="Ej: 123" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social">Contacto Social</Label>
            <Input id="social" placeholder="Ej: @usuario" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña temporal *</Label>
          <Input id="password" type="password" required />
          <p className="text-xs text-muted-foreground mt-1">
            El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Crear Usuario</Button>
      </DialogFooter>
    </form>
  );
}
