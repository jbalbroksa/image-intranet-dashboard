
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserType } from '@/types';

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
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    type: '',
    branch: '',
    position: '',
    extension: '',
    social: '',
    password: ''
  });
  
  const handleChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Primero registramos el usuario en auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      // Luego creamos el perfil del usuario
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          type: userData.type as UserType,
          branch_id: userData.branch || null,
          position: userData.position || null,
          extension: userData.extension || null,
          social_contact: userData.social || null
        });
      
      if (userError) throw userError;
      
      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado correctamente',
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error al crear usuario',
        description: error.message || 'Ocurrió un error al crear el usuario',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
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
            <Input 
              id="name" 
              placeholder="Nombre y apellidos" 
              required 
              value={userData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="correo@ejemplo.com" 
              required 
              value={userData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select 
              required
              value={userData.role}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="delegate">Delegado</SelectItem>
                <SelectItem value="employee">Empleado</SelectItem>
                <SelectItem value="collaborator">Colaborador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Usuario *</Label>
            <Select 
              required
              value={userData.type}
              onValueChange={(value) => handleChange('type', value)}
            >
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
            <Select 
              required
              value={userData.branch}
              onValueChange={(value) => handleChange('branch', value)}
            >
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
            <Input 
              id="position" 
              placeholder="Ej: Director de Departamento" 
              value={userData.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="extension">Extensión</Label>
            <Input 
              id="extension" 
              placeholder="Ej: 123"
              value={userData.extension}
              onChange={(e) => handleChange('extension', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social">Contacto Social</Label>
            <Input 
              id="social" 
              placeholder="Ej: @usuario"
              value={userData.social}
              onChange={(e) => handleChange('social', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña temporal *</Label>
          <Input 
            id="password" 
            type="password" 
            required
            value={userData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
}
