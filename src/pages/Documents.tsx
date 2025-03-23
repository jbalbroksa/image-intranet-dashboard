
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, FileText, ArrowUpDown, Filter, FileUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFilter = (category: string | null) => {
    setFilterCategory(category);
    if (category) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando documentos de categoría: ${category}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todos los documentos',
      });
    }
  };

  const handleSubmitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Documento subido',
      description: 'El documento ha sido cargado correctamente',
    });
    setIsUploadDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Repositorio de Documentos</h1>
          <p className="text-muted-foreground">Gestiona y organiza los documentos de la plataforma</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileUp className="mr-2 h-4 w-4" />
                Subir Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Subir Documento</DialogTitle>
                <DialogDescription>
                  Sube un nuevo documento al repositorio. Los campos marcados con * son obligatorios.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitDocument}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input id="title" placeholder="Introduce el título del documento" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" placeholder="Introduce la descripción del documento" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría de Documento *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contratos">Contratos</SelectItem>
                          <SelectItem value="polizas">Pólizas</SelectItem>
                          <SelectItem value="procedimientos">Procedimientos</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Compañía Relacionada</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Ninguna" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguna</SelectItem>
                          <SelectItem value="albroksa">Albroksa</SelectItem>
                          <SelectItem value="allianz">Allianz</SelectItem>
                          <SelectItem value="mapfre">Mapfre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productCategory">Categoría de Producto</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Ninguna" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguna</SelectItem>
                          <SelectItem value="auto">Automóviles</SelectItem>
                          <SelectItem value="hogar">Hogar</SelectItem>
                          <SelectItem value="vida">Vida</SelectItem>
                          <SelectItem value="salud">Salud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product">Producto Relacionado</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Ninguno" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Etiquetas</Label>
                    <Input id="tags" placeholder="Añadir etiquetas (separadas por comas)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Archivo *</Label>
                    <div className="border rounded-md p-4 text-center cursor-pointer hover:bg-accent transition-colors">
                      <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Seleccionar archivo</p>
                      <p className="text-xs text-muted-foreground">
                        Formatos permitidos: JPG, PNG, PDF, DOCX. Tamaño máximo: 10MB.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Subir</Button>
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
            placeholder="Buscar documentos..."
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
                {filterCategory || 'Todas las categorías'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilter(null)}>
                Todas las categorías
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('Contratos')}>
                Contratos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('Pólizas')}>
                Pólizas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('Procedimientos')}>
                Procedimientos
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
              <DropdownMenuItem>Título: A-Z</DropdownMenuItem>
              <DropdownMenuItem>Título: Z-A</DropdownMenuItem>
              <DropdownMenuItem>Fecha: Más reciente</DropdownMenuItem>
              <DropdownMenuItem>Fecha: Más antigua</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos los Documentos</TabsTrigger>
          <TabsTrigger value="recent">Añadidos Recientemente</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="py-12 text-center border border-dashed rounded-lg">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">No se encontraron documentos</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              No hay documentos disponibles en el repositorio. Sube un documento para empezar.
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Subir Documento
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <div className="py-12 text-center border border-dashed rounded-lg">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">No hay documentos recientes</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Los documentos añadidos recientemente aparecerán aquí.
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Subir Documento
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-0">
          <div className="py-12 text-center border border-dashed rounded-lg">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">No hay documentos favoritos</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Marca documentos como favoritos para acceder rápidamente a ellos desde aquí.
            </p>
            <Button variant="outline" asChild>
              <Link to="/documents">Ver todos los documentos</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
