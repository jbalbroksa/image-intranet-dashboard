
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsCard } from './NewsCard';

interface NewsGridProps {
  news: any[];
  showFeaturedOnly?: boolean;
}

export function NewsGrid({ news, showFeaturedOnly = false }: NewsGridProps) {
  const filteredNews = showFeaturedOnly ? news.filter(item => item.featured) : news;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNews.map(newsItem => (
        <NewsCard key={newsItem.id} news={newsItem} />
      ))}
      
      {!showFeaturedOnly && filteredNews.length > 0 && (
        <div className="flex items-center justify-center p-8 h-full bg-muted/30 border border-dashed rounded-lg">
          <Button asChild>
            <Link to="/news/create">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Noticia
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
