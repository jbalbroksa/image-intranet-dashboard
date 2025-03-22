
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Building2, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  FileText,
  ListTodo,
  Plus,
  Save,
  X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompanies } from '@/hooks/use-companies';
import { EditCompanyForm } from '@/components/companies/EditCompanyForm';
import { EditSpecificationForm } from '@/components/companies/EditSpecificationForm';
import { Skeleton } from '@/components/ui/skeleton';

// Mock related documents
const MOCK_DOCUMENTS = [
  { id: 'doc-1', title: 'Condiciones Generales', type: 'PDF', size: '1.2 MB', date: '2023-03-15' },
  { id: 'doc-2', title: 'Procedimientos de Tramitación', type: 'DOCX', size: '850 KB', date: '2023-02-28' }
];

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { 
    getCompany,
    updateCompany,
    deleteCompany,
    isLoading
  } = useCompanies();
  
  const [company, setCompany] = useState<any>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  
  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;
      setIsLoadingCompany(true);
      try {
        const companyData = await getCompany(id);
        setCompany(companyData);
      } catch (error) {
        console.error('Error fetching company:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la compañía",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCompany(false);
      }
    };
    
    fetchCompany();
  }, [id, getCompany, toast]);
  
  const handleDelete = () => {
    if (!id) return;
    
    deleteCompany(id);
    toast({
      title: "Compañía eliminada",
      description: "La compañía ha sido eliminada correctamente"
    });
    navigate('/companies');
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Cambios guardados",
      description: "La información de la compañía ha sido actualizada"
    });
  };

  if (isLoadingCompany) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-md" />
          <Skeleton className="h-64 rounded-md" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium mb-2">Compañía no encontrada</h3>
        <p className="text-muted-foreground mb-4">No se pudo encontrar la compañía con ID: {id}</p>
        <Button asChild>
          <Link to="/companies">Volver a Compañías</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/companies">Compañías</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{company.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={company.name} 
              className="h-16 w-16 object-contain bg-white p-1 rounded-md border"
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-md">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{company.name}</h1>
              <Badge variant={company.classification === 'Preferente' ? 'default' : 'outline'}>
                {company.classification}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <a 
                href={`https://${company.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {company.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Editar Compañía</DialogTitle>
                <DialogDescription>
                  Actualice los datos de la compañía.
                </DialogDescription>
              </DialogHeader>
              <EditCompanyForm 
                company={company} 
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro de eliminar esta compañía?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente esta compañía y toda su información asociada.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button variant="outline" asChild>
            <Link to="/companies">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sitio Web</p>
                  <p>{company.website || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email del Responsable</p>
                  <p>{company.contactEmail || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">URL de Acceso para Mediadores</p>
                  <p>{company.agentAccessUrl || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clasificación</p>
                  <p>{company.classification || 'No especificada'}</p>
                </div>
                <Separator />
                <div className="pt-2">
                  <p className="text-sm font-medium text-muted-foreground">Última actualización</p>
                  <p>{new Date(company.lastUpdated).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Documentos Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                {MOCK_DOCUMENTS.length > 0 ? (
                  <div className="space-y-3">
                    {MOCK_DOCUMENTS.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{doc.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center border border-dashed rounded-lg">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                    <h3 className="font-medium mb-1">No hay documentos</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      No se han añadido documentos para esta compañía.
                    </p>
                    <Button asChild size="sm">
                      <Link to="/documents/upload">Añadir Documento</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Especificaciones Particulares</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-1">
                {company.specifications && company.specifications.map((spec: any) => (
                  <div key={spec.id} className="py-3 border-b last:border-0">
                    <h3 className="font-medium mb-1">{spec.category}</h3>
                    <EditSpecificationForm 
                      specification={spec}
                      companyId={company.id}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <div className="text-center py-12 border border-dashed rounded-lg">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">Gestión de documentos</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Aquí podrás ver y gestionar todos los documentos relacionados con esta compañía.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild>
                <Link to="/documents/upload">
                  <Plus className="mr-2 h-4 w-4" />
                  Subir Documento
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/documents">Ver Repositorio</Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="text-center py-12 border border-dashed rounded-lg">
            <ListTodo className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">Productos de la compañía</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Aquí podrás ver y gestionar los productos relacionados con esta compañía.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild>
                <Link to="/products/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Producto
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/products">Ver Productos</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
