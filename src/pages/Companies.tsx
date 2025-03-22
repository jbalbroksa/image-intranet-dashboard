
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Building2, ArrowUpDown, Filter, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Mock data for companies
const MOCK_COMPANIES = [
  {
    id: 'company-1',
    name: 'Albroksa Correduría de Seguros',
    logo: '/lovable-uploads/3262e080-8a5a-44ab-b5d6-d21169144a41.png',
    website: 'albroksa.com',
    contactEmail: 'tecnologia@albroksa.com',
    classification: 'Preferente',
    createdAt: '2023-01-01',
    lastUpdated: '2023-03-20',
  },
  {
    id: 'company-2',
    name: 'Allianz',
    logo: '/lovable-uploads/7bac3fa5-785d-4025-9e45-32f9364c7004.png',
    website: 'allianz.es',
    contactEmail: undefined,
    classification: 'Preferente',
    createdAt: '2023-01-02',
    lastUpdated: '2023-03-15',
  },
  {
    id: 'company-3',
    name: 'Mapfre',
    logo: undefined,
    website: 'mapfre.es',
    contactEmail: 'info@mapfre.es',
    classification: 'Estándar',
    createdAt: '2023-01-03',
    lastUpdated: '2023-03-10',
  },
  {
    id: 'company-4',
    name: 'AXA Seguros',
    logo: undefined,
    website: 'axa.es',
    contactEmail: 'info@axa.es',
    classification: 'Estándar',
    createdAt: '2023-01-04',
    lastUpdated: '2023-03-05',
  },
];

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFilter = (classification: string | null) => {
    setSelectedClassification(classification);
    if (classification) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando compañías con clasificación: ${classification}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las compañías',
      });
    }
  };

  const filteredCompanies = MOCK_COMPANIES.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassification = selectedClassification ? company.classification === selectedClassification : true;
    return matchesSearch && matchesClassification;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Compañías</h1>
          <p className="text-muted-foreground">Gestión de las compañías aseguradoras</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/companies/create">
              <Plus className="mr-2 h-4 w-4" />
              Crear Compañía
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar compañías..."
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
                {selectedClassification || 'Todas las clasificaciones'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilter(null)}>
                Todas las clasificaciones
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('Preferente')}>
                Preferente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('Estándar')}>
                Estándar
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
              <DropdownMenuItem>Actualización: Más reciente</DropdownMenuItem>
              <DropdownMenuItem>Actualización: Más antigua</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <Link 
              key={company.id}
              to={`/companies/${company.id}`}
              className="block"
            >
              <Card className="h-full card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {company.logo ? (
                        <img 
                          src={company.logo} 
                          alt={company.name} 
                          className="h-12 w-12 object-contain bg-white p-1 rounded-md border"
                        />
                      ) : (
                        <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-base">{company.name}</h3>
                          <Badge variant={company.classification === 'Preferente' ? 'default' : 'outline'}>
                            {company.classification}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-sm text-muted-foreground">{company.website}</p>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Email del responsable:</p>
                      <p className={!company.contactEmail ? 'italic text-muted-foreground' : ''}>
                        {company.contactEmail || 'No disponible'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Última actualización:</p>
                      <p>{new Date(company.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed rounded-lg">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="font-medium mb-1">No se encontraron compañías</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {searchTerm || selectedClassification
                ? 'No hay resultados para tu búsqueda. Intenta con otros términos o filtros.'
                : 'Añade una compañía para empezar.'}
            </p>
            <Button asChild size="sm">
              <Link to="/companies/create">Añadir Compañía</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
