
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface ProductAuthorProps {
  authorId: string;
}

interface Author {
  name: string;
  avatar?: string;
}

export function ProductAuthor({ authorId }: ProductAuthorProps) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthor() {
      if (!authorId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', authorId)
          .single();
        
        if (error) throw error;
        
        setAuthor({
          name: data.name,
          avatar: data.avatar
        });
      } catch (error) {
        console.error('Error fetching author:', error);
        setAuthor({
          name: 'Usuario desconocido',
          avatar: undefined
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAuthor();
  }, [authorId]);
  
  if (isLoading) {
    return <div className="h-8 w-full max-w-[300px] animate-pulse rounded-md bg-muted"></div>;
  }
  
  if (!author) {
    return <div className="text-sm text-muted-foreground">Autor no encontrado</div>;
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <Avatar className="h-8 w-8">
        <AvatarImage src={author.avatar} />
        <AvatarFallback>{author.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm font-medium">{author.name}</div>
        <div className="text-xs text-muted-foreground">
          <span>Autor del producto</span>
        </div>
      </div>
    </div>
  );
}
