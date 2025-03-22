
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersHeader } from '@/components/users/UsersHeader';
import { UsersFilters } from '@/components/users/UsersFilters';
import { UsersGrid } from '@/components/users/UsersGrid';

// Mock data for users
const MOCK_USERS = [
  {
    id: 'user-1',
    name: 'José',
    email: 'jose@conectaseguros.com',
    avatar: '/lovable-uploads/6d6736eb-dda1-4754-b5ef-0c42c4078fab.png',
    role: 'admin',
    type: 'Administrador',
    branch: 'Servicios Centrales',
    createdAt: '2023-01-15'
  },
  {
    id: 'user-2',
    name: 'José Báez Fernández',
    initials: 'JBF',
    email: 'josebaez@albroksa.com',
    avatar: undefined,
    role: 'admin',
    type: 'Administrador',
    branch: 'Servicios Centrales',
    position: 'Director de Tecnología',
    extension: '26',
    social: '@JOSEBAEZALBROKSA',
    createdAt: '2023-03-20'
  }
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const handleUserCreated = () => {
    // En una aplicación real, aquí recargaríamos los datos de usuarios
    console.log('Usuario creado correctamente');
  };

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesType = filterType ? user.type === filterType : true;
    const matchesBranch = filterBranch ? user.branch === filterBranch : true;
    return matchesSearch && matchesRole && matchesType && matchesBranch;
  });

  return (
    <div className="animate-fade-in">
      <UsersHeader onUserCreated={handleUserCreated} />
      
      <UsersFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRole={filterRole}
        onFilterRole={setFilterRole}
        filterType={filterType}
        onFilterType={setFilterType}
        filterBranch={filterBranch}
        onFilterBranch={setFilterBranch}
      />

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="branches">Sucursales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-0">
          <UsersGrid 
            users={filteredUsers} 
            onCreateClick={() => setIsCreateDialogOpen(true)} 
          />
        </TabsContent>
        
        <TabsContent value="branches" className="mt-0">
          <UsersGrid 
            users={[]} 
            onCreateClick={() => {}} 
            showBranchesTab={true} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
