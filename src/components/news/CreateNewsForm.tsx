
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNews } from '@/hooks/use-news';
import { useCompanies } from '@/hooks/use-companies';

// Categorías de noticias
const NEWS_CATEGORIES = [
  'Actualidad',
  'Comunicados',
  'Eventos',
  'Formación',
  'Productos',
  'Tecnología',
  'Otros'
];

interface CreateNewsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateNewsForm({ onSuccess, onCancel }: CreateNewsFormProps) {
  const { createNews, isLoading } = useNews();
  const { companies, isLoadingCompanies } = useCompanies();
  
  const [newsData, setNewsData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    featured: false,
    coverImage: '',
    companyId: '',
    tags: []
  });
  
  const handleChange = (field: string, value: any) => {
    setNewsData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createNews({
      title: newsData.title,
      excerpt: newsData.excerpt || '',
      content: newsData.content,
      category: newsData.category,
      featured: newsData.featured,
      coverImage: newsData.coverImage || undefined,
      companyId: newsData.companyId || undefined,
      tags: newsData.tags.length > 0 ? newsData.tags : undefined
    }, {
      onSuccess
    });
  };
  
  return (
    <form onSubmit={handleCreateNews}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input 
            id="title" 
            placeholder="Título de la noticia" 
            required 
            value={newsData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select 
              required
              value={newsData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {NEWS_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Compañía relacionada</Label>
            <Select 
              value={newsData.companyId}
              onValueChange={(value) => handleChange('companyId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una compañía (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Ninguna</SelectItem>
                {companies?.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="excerpt">Resumen</Label>
          <Textarea 
            id="excerpt" 
            placeholder="Breve resumen de la noticia" 
            value={newsData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            className="resize-none"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Contenido *</Label>
          <Textarea 
            id="content" 
            placeholder="Contenido completo de la noticia" 
            required
            value={newsData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="resize-none"
            rows={6}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coverImage">URL de la imagen de portada</Label>
          <Input 
            id="coverImage" 
            placeholder="https://ejemplo.com/imagen.jpg" 
            value={newsData.coverImage}
            onChange={(e) => handleChange('coverImage', e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="featured" 
            checked={newsData.featured}
            onCheckedChange={(checked) => handleChange('featured', checked)}
          />
          <Label htmlFor="featured">Destacar noticia</Label>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="mt-2 sm:mt-0">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Noticia'}
        </Button>
      </div>
    </form>
  );
}
