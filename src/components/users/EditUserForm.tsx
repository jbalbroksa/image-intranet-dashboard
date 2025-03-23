
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Branch, UserRole, UserType } from '@/types';
import { useUsers } from '@/hooks/use-users';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// User types
const USER_TYPES = [
  'Administrador',
  'Responsable de Departamento',
  'Delegación',
  'Empleado SSCC',
  'Colaborador'
];

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Correo electrónico inválido'),
  role: z.string().min(1, 'El rol es obligatorio'),
  type: z.string().min(1, 'El tipo de usuario es obligatorio'),
  branchId: z.string().min(1, 'La sucursal es obligatoria'),
  position: z.string().optional(),
  extension: z.string().optional(),
  socialContact: z.string().optional(),
  avatar: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserFormProps {
  user: User;
  branches: Branch[];
  onSuccess: () => void;
  isAdmin: boolean;
}

export function EditUserForm({ user, branches, onSuccess, isAdmin }: EditUserFormProps) {
  const { updateUser, isLoading } = useUsers();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Initialize form with user data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      type: user.type,
      branchId: user.branchId || '',
      position: user.position || '',
      extension: user.extension || '',
      socialContact: user.socialContact || '',
      avatar: user.avatar || '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      
      // If not admin, only allow editing profile info, not role/type
      const updateData: Partial<User> & { id: string } = {
        id: user.id,
        name: data.name,
        position: data.position || undefined,
        extension: data.extension || undefined,
        socialContact: data.socialContact || undefined,
        avatar: data.avatar || undefined,
      };
      
      // Admin can update all fields
      if (isAdmin) {
        updateData.email = data.email;
        updateData.role = data.role as UserRole;
        updateData.type = data.type as UserType;
        updateData.branchId = data.branchId;
      }
      
      updateUser(updateData, {
        onSuccess: () => {
          toast({
            title: "Usuario actualizado",
            description: "Los datos del usuario han sido actualizados correctamente",
          });
          onSuccess();
        },
        onError: (err) => {
          console.error("Error updating user:", err);
          setError(err instanceof Error ? err.message : 'Error al actualizar el usuario');
        }
      });
    } catch (err: any) {
      console.error("Exception in update user form handler:", err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el usuario');
    }
  };

  const renderUserTypeOption = (type: string) => (
    <SelectItem key={type} value={type}>
      {type}
    </SelectItem>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre y apellidos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="correo@ejemplo.com" 
                      {...field} 
                      disabled={!isAdmin}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    disabled={!isAdmin}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="delegate">Delegado</SelectItem>
                      <SelectItem value="employee">Empleado</SelectItem>
                      <SelectItem value="collaborator">Colaborador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Usuario</FormLabel>
                  <Select
                    disabled={!isAdmin}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_TYPES.map(renderUserTypeOption)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal</FormLabel>
                  <Select
                    disabled={!isAdmin}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una sucursal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches && branches.length > 0 ? (
                        branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-branches" disabled>
                          No hay sucursales disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Director de Departamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="extension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extensión</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacto Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: @usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de Avatar</FormLabel>
                <FormControl>
                  <Input placeholder="https://ejemplo.com/avatar.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
