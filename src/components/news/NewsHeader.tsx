
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NewsHeader() {
  return (
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
  );
}
