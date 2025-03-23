
import { Link } from 'react-router-dom';
import { Mail, MapPin, User, UsersIcon, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    type: string;
    branch: string;
    position?: string;
    extension?: string;
    socialContact?: string;
    createdAt: string;
  };
}

export function UserCard({ user }: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{user.type}</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/users/${user.id}`}>
                Detalles
              </Link>
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{user.email}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">Sucursal: {user.branch}</p>
            </div>
            
            {user.position && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{user.position}</p>
              </div>
            )}
            
            {user.extension && (
              <div className="flex items-center gap-3">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">Extensión: {user.extension}</p>
              </div>
            )}
            
            {user.socialContact && (
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">Telegram: {user.socialContact}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t px-6 py-3 bg-muted/30 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            ID: {user.id.substring(0, 8)}...
          </div>
          <div className="text-sm text-muted-foreground">
            Creado: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
