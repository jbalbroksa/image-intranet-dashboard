
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNews } from '@/hooks/use-news';
import { Switch } from '@/components/ui/switch';
import { useCompanies } from '@/hooks/use-companies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NEWS_CATEGORIES = [
  'Actualidad',
  'Comunicados',
  'Eventos',
  'Formación',
  'Novedades',
  'Productos'
];

interface CreateNewsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateNewsForm({ onSuccess, onCancel }: CreateNewsFormProps) {
  const { createNews, isLoading } = useNews();
  const { companies, isLoadingCompanies } = useCompanies();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    companyId: '',
    featured: false,
    tags: [] as string[]
  });
  
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNews(formData);
    onSuccess();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input 
          id="title" 
          value={formData.title} 
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">Resumen</Label>
        <Textarea 
          id="excerpt" 
          value={formData.excerpt} 
          onChange={(e) => handleChange('excerpt', e.target.value)}
          placeholder="Breve resumen de la noticia"
          className="resize-y min-h-[80px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Contenido *</Label>
        <Textarea 
          id="content" 
          value={formData.content} 
          onChange={(e) => handleChange('content', e.target.value)}
          required
          className="resize-y min-h-[150px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="coverImage">URL de Imagen de Portada</Label>
          <Input 
            id="coverImage" 
            value={formData.coverImage} 
            onChange={(e) => handleChange('coverImage', e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleChange('category', value)}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Seleccione una categoría" />
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyId">Compañía Relacionada</Label>
          <Select 
            value={formData.companyId} 
            onValueChange={(value) => handleChange('companyId', value)}
          >
            <SelectTrigger id="companyId">
              <SelectValue placeholder="Seleccione una compañía (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {!isLoadingCompanies && companies && companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Etiquetas</Label>
          <Input 
            id="tags" 
            value={formData.tags.join(', ')} 
            onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
            placeholder="Separadas por comas"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => handleChange('featured', checked)}
        />
        <Label htmlFor="featured">Destacar noticia</Label>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Noticia'}
        </Button>
      </div>
    </form>
  );
}
