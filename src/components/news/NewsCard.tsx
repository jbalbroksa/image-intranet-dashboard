
import { Link } from 'react-router-dom';
import { Newspaper, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    excerpt?: string;
    featured: boolean;
    coverImage?: string;
    category: string;
    companyName?: string;
    author: {
      name: string;
      avatar?: string;
    };
    publishedAt: string;
  };
}

export function NewsCard({ news }: NewsCardProps) {
  return (
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
  );
}
