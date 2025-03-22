
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsHeaderProps {
  onCreateNews: () => void;
}

export function NewsHeader({ onCreateNews }: NewsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Noticias</h1>
        <p className="text-muted-foreground">Manténgase al día con las últimas noticias y actualizaciones</p>
      </div>
      <div className="mt-4 md:mt-0 flex gap-2">
        <Button onClick={onCreateNews}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Noticia
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Ver Resumen</Link>
        </Button>
      </div>
    </div>
  );
}
