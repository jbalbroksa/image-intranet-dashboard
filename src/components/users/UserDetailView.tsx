
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Building2, 
  CalendarClock, 
  Shield, 
  Phone, 
  AtSign 
} from 'lucide-react';

interface UserDetailViewProps {
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

export function UserDetailView({ user }: UserDetailViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary">{user.role}</Badge>
                <Badge variant="outline">{user.type}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Correo Electrónico</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {user.position && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Cargo</h3>
                  <p className="text-sm text-muted-foreground">{user.position}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Sucursal</h3>
                <p className="text-sm text-muted-foreground">{user.branch}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Fecha de Creación</h3>
                <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Rol del Sistema</h3>
                <p className="text-sm text-muted-foreground">{user.role}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user.role === 'admin' && 'Acceso completo a todas las funciones del sistema'}
                  {user.role === 'manager' && 'Gestión de recursos y usuarios sin permisos de administración'}
                  {user.role === 'delegate' && 'Gestión de recursos sin permisos de administración de usuarios'}
                  {user.role === 'employee' && 'Acceso a recursos de la empresa sin permisos de gestión avanzada'}
                  {user.role === 'collaborator' && 'Acceso restringido a recursos específicos'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Tipo de Usuario</h3>
                <p className="text-sm text-muted-foreground">{user.type}</p>
              </div>
            </div>

            {user.extension && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Extensión</h3>
                  <p className="text-sm text-muted-foreground">{user.extension}</p>
                </div>
              </div>
            )}

            {user.socialContact && (
              <div className="flex items-start gap-3">
                <AtSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Contacto Social</h3>
                  <p className="text-sm text-muted-foreground">{user.socialContact}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="mt-4 pt-4 border-t border-border w-full">
                <p className="text-xs text-muted-foreground">
                  ID: {user.id}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
