
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { NewsHeader } from '@/components/news/NewsHeader';
import { NewsFilters } from '@/components/news/NewsFilters';
import { NewsGrid } from '@/components/news/NewsGrid';

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

  const filteredNews = MOCK_NEWS.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? news.category === filterCategory : true;
    const matchesCompany = filterCompany ? news.companyName === filterCompany : true;
    return matchesSearch && matchesCategory && matchesCompany;
  });

  return (
    <div className="animate-fade-in">
      <NewsHeader />
      
      <NewsFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onFilterCategory={setFilterCategory}
        filterCompany={filterCompany}
        onFilterCompany={setFilterCompany}
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
          <NewsGrid news={filteredNews} showFeaturedOnly={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
