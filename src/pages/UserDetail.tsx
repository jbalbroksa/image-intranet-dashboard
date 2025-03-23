
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/use-users';
import { useBranches } from '@/hooks/use-branches';
import { useAuth } from '@/context/AuthContext';
import { UserRole, UserType } from '@/types';
import { EditUserForm } from '@/components/users/EditUserForm';
import { UserDetailView } from '@/components/users/UserDetailView';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { users, isLoadingUsers, usersError, updateUser, deleteUser } = useUsers();
  const { branches } = useBranches();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Find the user from the users array
  const user = users?.find(u => u.id === id);
  
  // Determine if current user has permission to edit
  const hasEditPermission = currentUser?.role === 'admin' || currentUser?.id === id;
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/users');
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (id && confirmDelete) {
      deleteUser(id, {
        onSuccess: () => {
          navigate('/users');
        }
      });
    } else {
      setConfirmDelete(true);
    }
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  if (isLoadingUsers) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (usersError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {usersError.message || 'Ocurrió un error al cargar los datos del usuario'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Usuario no encontrado</AlertTitle>
        <AlertDescription>
          No se encontró el usuario solicitado. 
          <Link to="/users" className="ml-2 underline">
            Volver a la lista de usuarios
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  // Get branch name from branch ID
  const branchName = branches?.find(b => b.id === user.branchId)?.name || 'No asignada';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalle de Usuario</h1>
        </div>
        
        {currentUser?.role === 'admin' && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancelar' : 'Editar Usuario'}
            </Button>
            
            {!isEditing && (
              <>
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDeleteUser}>
                      Confirmar
                    </Button>
                    <Button variant="outline" onClick={cancelDelete}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="destructive" 
                    onClick={() => setConfirmDelete(true)}
                    disabled={currentUser?.id === user.id}
                  >
                    Eliminar
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          {hasEditPermission && (
            <TabsTrigger value="edit">Editar Información</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <UserDetailView 
            user={{
              ...user,
              branch: branchName
            }} 
          />
        </TabsContent>
        
        {hasEditPermission && (
          <TabsContent value="edit" className="mt-6">
            <EditUserForm 
              user={user}
              branches={branches || []}
              onSuccess={() => setIsEditing(false)}
              isAdmin={currentUser?.role === 'admin'}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
