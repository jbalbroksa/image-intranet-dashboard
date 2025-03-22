
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, User, ArrowUpDown, Filter, MapPin, Mail, Shield, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

// User types
const USER_TYPES = [
  'Administrador',
  'Responsable de Departamento',
  'Delegación',
  'Empleado SSCC',
  'Colaborador'
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFilterRole = (role: string | null) => {
    setFilterRole(role);
    if (role) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando usuarios con rol: ${role}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todos los roles',
      });
    }
  };

  const handleFilterType = (type: string | null) => {
    setFilterType(type);
    if (type) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando usuarios de tipo: ${type}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todos los tipos',
      });
    }
  };

  const handleFilterBranch = (branch: string | null) => {
    setFilterBranch(branch);
    if (branch) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando usuarios de sucursal: ${branch}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las sucursales',
      });
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Usuario creado',
      description: 'El usuario ha sido creado correctamente',
    });
    setIsCreateDialogOpen(false);
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

  const renderUserTypeOption = (type: string) => (
    <SelectItem key={type} value={type}>
      {type}
    </SelectItem>
  );

  return (
    <div className="animate-fade-in">
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
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filterRole || 'Todos los roles'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterRole(null)}>
                Todos los roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterRole('admin')}>
                Administrador
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterRole('manager')}>
                Manager
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterRole('user')}>
                Usuario
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filterType || 'Todos los tipos'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterType(null)}>
                Todos los tipos
              </DropdownMenuItem>
              {USER_TYPES.map(type => (
                <DropdownMenuItem 
                  key={type} 
                  onClick={() => handleFilterType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filterBranch || 'Todas las sucursales'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterBranch(null)}>
                Todas las sucursales
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterBranch('Servicios Centrales')}>
                Servicios Centrales
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Nombre: A-Z</DropdownMenuItem>
              <DropdownMenuItem>Nombre: Z-A</DropdownMenuItem>
              <DropdownMenuItem>Fecha: Más reciente</DropdownMenuItem>
              <DropdownMenuItem>Fecha: Más antigua</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="branches">Sucursales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <Card key={user.id} className="overflow-hidden card-hover">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : (
                            <AvatarFallback>{user.initials || user.name[0]}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{user.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/users/${user.id}`}>
                          Detalles
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{user.email}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">Sucursal: {user.branch}</p>
                      </div>
                      
                      {user.position && (
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{user.position}</p>
                        </div>
                      )}
                      
                      {user.extension && (
                        <div className="flex items-center gap-3">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">Extensión: {user.extension}</p>
                        </div>
                      )}
                      
                      {user.social && (
                        <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">Telegram: {user.social}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t px-6 py-3 bg-muted/30 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      ID: {user.id.substring(0, 8)}...
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Creado: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex items-center justify-center p-8 h-full bg-muted/30 border border-dashed rounded-lg">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Usuario
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="branches" className="mt-0">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
