
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersHeader } from '@/components/users/UsersHeader';
import { UsersFilters } from '@/components/users/UsersFilters';
import { UsersGrid } from '@/components/users/UsersGrid';
import { useUsers } from '@/hooks/use-users';
import { useBranches } from '@/hooks/use-branches';
import { User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  const { users, isLoadingUsers, usersError } = useUsers();
  const { branches, isLoadingBranches, branchesError } = useBranches();
  
  const handleUserCreated = () => {
    setIsCreateDialogOpen(false);
  };

  useEffect(() => {
    if (users) {
      const filtered = users.filter(user => {
        const matchesSearch = 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole ? user.role === filterRole : true;
        const matchesType = filterType ? user.type === filterType : true;
        const matchesBranch = filterBranch ? user.branchId === filterBranch : true;
        return matchesSearch && matchesRole && matchesType && matchesBranch;
      });
      
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, filterRole, filterType, filterBranch]);

  // Extract unique roles and types for filters
  const roles = users ? [...new Set(users.map(user => user.role))] : [];
  const types = users ? [...new Set(users.map(user => user.type))] : [];

  if (usersError || branchesError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {usersError?.message || branchesError?.message || 'Ocurrió un error inesperado al cargar datos'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <UsersHeader onUserCreated={handleUserCreated} />
      
      {isLoadingUsers || isLoadingBranches ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <UsersFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterRole={filterRole}
            onFilterRole={setFilterRole}
            filterType={filterType}
            onFilterType={setFilterType}
            filterBranch={filterBranch}
            onFilterBranch={setFilterBranch}
            roles={roles}
            types={types}
            branches={branches || []}
          />

          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="branches">Sucursales</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-0">
              {filteredUsers.length > 0 ? (
                <UsersGrid 
                  users={filteredUsers} 
                  onCreateClick={() => setIsCreateDialogOpen(true)} 
                />
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">No se encontraron usuarios que coincidan con los criterios de búsqueda</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Crear Nuevo Usuario
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="branches" className="mt-0">
              <UsersGrid 
                users={[]} 
                onCreateClick={() => {}} 
                showBranchesTab={true} 
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

// Make sure we import the Button component
import { Button } from '@/components/ui/button';
