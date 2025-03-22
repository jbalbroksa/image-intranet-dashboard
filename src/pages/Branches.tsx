
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MapPin, ArrowUpDown, Filter, Users, Mail, Phone, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Mock data for branches
const MOCK_BRANCHES = [
  {
    id: 'branch-1',
    name: 'Servicios Centrales',
    address: 'Calle Ceres, 21, local Albroksa',
    postalCode: '10004',
    city: 'Cáceres',
    province: 'Cáceres',
    contactPerson: 'Angel Mirat',
    email: 'amirat@albroksa.com',
    phone: '927233430',
    website: 'albroksa.com',
    createdAt: '2020-01-20',
  }
];

export default function Branches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvince, setFilterProvince] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFilter = (province: string | null) => {
    setFilterProvince(province);
    if (province) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando sucursales de la provincia: ${province}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las sucursales',
      });
    }
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Sucursal creada',
      description: 'La sucursal ha sido creada correctamente',
    });
    setIsCreateDialogOpen(false);
  };

  const filteredBranches = MOCK_BRANCHES.filter(branch => {
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.province.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = filterProvince ? branch.province === filterProvince : true;
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Gestión de Sucursales</h1>
          <p className="text-muted-foreground">Administra las sucursales de la franquicia</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Sucursal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Crear Sucursal</DialogTitle>
                <DialogDescription>
                  Añade una nueva sucursal al sistema. Los campos marcados con * son obligatorios.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBranch}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input id="name" placeholder="Nombre de la sucursal" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Persona de Contacto</Label>
                      <Input id="contactPerson" placeholder="Nombre y apellidos" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input id="address" placeholder="Calle, número, piso..." required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal *</Label>
                      <Input id="postalCode" placeholder="Ej: 28001" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Localidad *</Label>
                      <Input id="city" placeholder="Ej: Madrid" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Provincia *</Label>
                      <Input id="province" placeholder="Ej: Madrid" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="Ej: 912345678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Página Web</Label>
                      <Input id="website" placeholder="Ej: https://www.ejemplo.com" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Guardar</Button>
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
            placeholder="Buscar sucursales..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filterProvince || 'Todas las provincias'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilter(null)}>
                Todas las provincias
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('Cáceres')}>
                Cáceres
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('Madrid')}>
                Madrid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('Barcelona')}>
                Barcelona
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
              <DropdownMenuItem>Ciudad: A-Z</DropdownMenuItem>
              <DropdownMenuItem>Provincia: A-Z</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="branches">
        <TabsList className="mb-6">
          <TabsTrigger value="branches">Sucursales</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branches" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBranches.map(branch => (
              <Card key={branch.id} className="overflow-hidden card-hover">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{branch.name}</h3>
                          <p className="text-sm text-muted-foreground">{branch.city}, {branch.province}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/branches/${branch.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">{branch.address}</p>
                          <p className="text-sm">{branch.postalCode} {branch.city}</p>
                          <p className="text-sm">{branch.province}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{branch.contactPerson}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{branch.email}</p>
                      </div>
                      
                      {branch.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{branch.phone}</p>
                        </div>
                      )}
                      
                      {branch.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{branch.website}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t px-6 py-3 bg-muted/30 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      ID: {branch.id.substring(0, 8)}...
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Creado: {new Date(branch.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex items-center justify-center p-8 h-full bg-muted/30 border border-dashed rounded-lg">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Sucursal
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          <div className="py-12 text-center border border-dashed rounded-lg">
            <Users className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">Gestión de usuarios por sucursal</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Aquí podrás ver y gestionar todos los usuarios asignados a cada sucursal.
            </p>
            <Button asChild>
              <Link to="/users">
                Ir a Gestión de Usuarios
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
