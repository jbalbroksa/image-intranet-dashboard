
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { NewsHeader } from '@/components/news/NewsHeader';
import { NewsFilters } from '@/components/news/NewsFilters';
import { NewsGrid } from '@/components/news/NewsGrid';
import { useNews } from '@/hooks/use-news';
import type { News as NewsType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateNewsForm } from '@/components/news/CreateNewsForm';

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterCompany, setFilterCompany] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { news, isLoadingNews, newsError, createNews } = useNews();
  const [filteredNews, setFilteredNews] = useState<NewsType[]>([]);

  useEffect(() => {
    if (news) {
      const filtered = news.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? item.category === filterCategory : true;
        const matchesCompany = filterCompany ? item.companyId === filterCompany : true;
        return matchesSearch && matchesCategory && matchesCompany;
      });
      
      // Ensure each news item has proper author structure
      const processedNews = filtered.map(item => ({
        ...item,
        // Set default author object if none exists
        author: item.author ? 
          (typeof item.author === 'string' ? 
            { name: item.author } : 
            item.author) 
          : { name: 'Unknown' }
      }));
      
      setFilteredNews(processedNews);
    }
  }, [news, searchTerm, filterCategory, filterCompany]);

  // Extraer categorías únicas para los filtros
  const categories = news ? [...new Set(news.map(item => item.category))] : [];

  const handleCreateNewsSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  if (newsError) {
    return (
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium mb-2">Error al cargar noticias</h3>
        <p className="text-muted-foreground">{newsError.message || 'Ocurrió un error inesperado'}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <NewsHeader 
        onCreateNews={() => setIsCreateDialogOpen(true)} 
      />
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Noticia</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear una nueva noticia.
            </DialogDescription>
          </DialogHeader>
          <CreateNewsForm 
            onSuccess={handleCreateNewsSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {isLoadingNews ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <NewsFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterCategory={filterCategory}
            onFilterCategory={setFilterCategory}
            filterCompany={filterCompany}
            onFilterCompany={setFilterCompany}
            categories={categories}
            companies={news ? [...new Set(news.filter(item => item.companyId).map(item => ({ 
              id: item.companyId as string, 
              name: item.companyId as string 
            })))] : []}
          />

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Todas las Noticias</TabsTrigger>
              <TabsTrigger value="featured">Destacadas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <NewsGrid news={filteredNews} />
            </TabsContent>
            
            <TabsContent value="featured" className="mt-0">
              <NewsGrid news={filteredNews.filter(item => item.featured)} showFeaturedOnly={true} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
