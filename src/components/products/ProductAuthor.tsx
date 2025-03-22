
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProductAuthorProps {
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function ProductAuthor({ author, createdAt, updatedAt }: ProductAuthorProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Avatar className="h-8 w-8">
        <AvatarImage src={author.avatar} />
        <AvatarFallback>{author.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm font-medium">{author.name}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span>Publicado: {new Date(createdAt).toLocaleDateString()}</span>
          {updatedAt !== createdAt && (
            <>
              <span>•</span>
              <span>Actualizado: {new Date(updatedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
