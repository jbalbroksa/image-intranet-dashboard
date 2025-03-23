
import { Link } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserCard } from './UserCard';
import { User, Branch } from '@/types';

interface UsersGridProps {
  users: User[];
  branches?: Branch[];
  onCreateClick: () => void;
  showBranchesTab?: boolean;
}

export function UsersGrid({ users, branches = [], onCreateClick, showBranchesTab = false }: UsersGridProps) {
  if (showBranchesTab) {
    return (
      <div className="py-12 text-center border border-dashed rounded-lg">
        <MapPin className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium mb-2">Gestión de sucursales</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          Aquí podrás ver y gestionar todas las sucursales del sistema.
        </p>
        <Button asChild>
          <Link to="/branches">
            Ir a Gestión de Sucursales
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {users.map(user => {
        // Find the branch name for this user
        const branch = branches.find(b => b.id === user.branchId);
        const branchName = branch ? branch.name : 'No asignada';
        
        return (
          <UserCard 
            key={user.id} 
            user={{
              ...user,
              branch: branchName
            }} 
          />
        );
      })}
      
      <div className="flex items-center justify-center p-8 h-full bg-muted/30 border border-dashed rounded-lg">
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Usuario
        </Button>
      </div>
    </div>
  );
}
