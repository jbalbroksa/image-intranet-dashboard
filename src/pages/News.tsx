
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Newspaper, ArrowUpDown, Filter, Eye, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Mock data for news
const MOCK_NEWS = [
  {
    id: 'news-1',
    title: 'Título 1',
    content: 'Hola que tal?...',
    excerpt: 'Hola que tal?...',
    featured: true,
    coverImage: '/lovable-uploads/f3f0a2d3-983b-4f4c-8a95-e5e21590ac60.png',
    category: 'General',
    companyId: 'company-1',
    companyName: 'Albroksa Correduría de Seguros',
    author: {
      name: 'José',
      avatar: '/lovable-uploads/6d6736eb-dda1-4754-b5ef-0c42c4078fab.png'
    },
    publishedAt: '2023-03-21'
  }
];

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterCompany, setFilterCompany] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFilterCategory = (category: string | null) => {
    setFilterCategory(category);
    if (category) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando noticias de categoría: ${category}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las categorías',
      });
    }
  };

  const handleFilterCompany = (company: string | null) => {
    setFilterCompany(company);
    if (company) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando noticias de compañía: ${company}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las compañías',
      });
    }
  };

  const filteredNews = MOCK_NEWS.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? news.category === filterCategory : true;
    const matchesCompany = filterCompany ? news.companyName === filterCompany : true;
    return matchesSearch && matchesCategory && matchesCompany;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Noticias</h1>
          <p className="text-muted-foreground">Gestiona las noticias y anuncios de la plataforma</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/news/create">
              <Plus className="mr-2 h-4 w-4" />
              Crear Noticia
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
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
                {filterCategory || 'Todas las categorías'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterCategory(null)}>
                Todas las categorías
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterCategory('General')}>
                General
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterCategory('Productos')}>
                Productos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterCategory('Eventos')}>
                Eventos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filterCompany || 'Todas las compañías'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterCompany(null)}>
                Todas las compañías
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterCompany('Albroksa Correduría de Seguros')}>
                Albroksa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterCompany('Allianz')}>
                Allianz
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
          <TabsTrigger value="all">Todas las Noticias</TabsTrigger>
          <TabsTrigger value="featured">Destacadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map(news => (
              <Card key={news.id} className="overflow-hidden card-hover">
                <div className="aspect-video relative">
                  {news.coverImage ? (
                    <img 
                      src={news.coverImage} 
                      alt={news.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted/50 w-full h-full flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant={news.featured ? 'default' : 'secondary'}>
                      {news.featured ? 'Destacado' : 'General'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">{news.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {news.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Badge variant="outline">{news.category}</Badge>
                      {news.companyName && (
                        <Badge variant="outline">{news.companyName}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="px-4 py-3 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={news.author.avatar} />
                      <AvatarFallback>{news.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <span className="text-muted-foreground">{news.author.name}</span>
                      <span className="text-muted-foreground ml-2">·</span>
                      <span className="text-muted-foreground ml-2">
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/news/${news.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/news/${news.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            <div className="flex items-center justify-center p-8 h-full bg-muted/30 border border-dashed rounded-lg">
              <Button asChild>
                <Link to="/news/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Noticia
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="featured" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.filter(news => news.featured).map(news => (
              <Card key={news.id} className="overflow-hidden card-hover">
                <div className="aspect-video relative">
                  {news.coverImage ? (
                    <img 
                      src={news.coverImage} 
                      alt={news.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted/50 w-full h-full flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge>Destacado</Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">{news.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {news.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Badge variant="outline">{news.category}</Badge>
                      {news.companyName && (
                        <Badge variant="outline">{news.companyName}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="px-4 py-3 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={news.author.avatar} />
                      <AvatarFallback>{news.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <span className="text-muted-foreground">{news.author.name}</span>
                      <span className="text-muted-foreground ml-2">·</span>
                      <span className="text-muted-foreground ml-2">
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/news/${news.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/news/${news.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
