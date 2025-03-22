
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Building2, 
  CalendarDays,
  ArrowRight,
  Bell,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { notifications, addNotification } = useNotifications();

  // Recent notifications for the dashboard view
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de la plataforma intranet de franquicia</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link to="/documents/upload">Subir Documento</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/news/create">Crear Noticia</Link>
          </Button>
        </div>
      </div>

      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 md:p-8 shadow-sm">
          <div className="max-w-4xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Bienvenido de nuevo, {user?.name}</h2>
            <p className="text-muted-foreground mb-6">Aquí tienes un resumen de la actividad reciente de la plataforma.</p>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/dashboard">
                  Ver informes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/dashboard">Gestionar usuarios</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard">Configuración</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Documentos" 
            value="152" 
            description="Total documentos"
            icon={FileText}
            trend={{ value: 12, label: "este mes", positive: true }}
          />
          <StatCard 
            title="Usuarios" 
            value="28" 
            description="Usuarios activos"
            icon={Users}
          />
          <StatCard 
            title="Compañías" 
            value="18" 
            description="Compañías de seguros"
            icon={Building2}
          />
          <StatCard 
            title="Eventos" 
            value="5" 
            description="Próximos eventos"
            icon={CalendarDays}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Documentos Recientes</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-primary">
                <Link to="/documents">Ver todos <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Empty state for demo */}
                <div className="flex items-center justify-center py-8 text-center border border-dashed rounded-lg">
                  <div className="max-w-xs">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                    <h3 className="font-medium mb-1">No hay documentos recientes</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sube un documento para empezar a gestionar el repositorio.
                    </p>
                    <Button asChild size="sm">
                      <Link to="/documents/upload">Subir Documento</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Noticias Destacadas</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-primary">
                <Link to="/news">Ver todas <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border">
                  <div className="h-36 bg-gradient-to-r from-primary/40 to-primary/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Badge className="mb-2" variant="outline">General</Badge>
                        <h3 className="text-lg font-semibold text-foreground">Título 1</h3>
                        <p className="text-sm text-muted-foreground">Hola que tal?...</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-card flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>JG</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{user?.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">21/03/2023</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Notificaciones</CardTitle>
              <CardDescription>Recibe actualizaciones sobre la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              {recentNotifications.length > 0 ? (
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <div key={notification.id} className="flex gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center border border-dashed rounded-lg">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                  <h3 className="font-medium mb-1">No hay notificaciones</h3>
                  <p className="text-sm text-muted-foreground">
                    Las notificaciones aparecerán aquí
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm" 
                onClick={() => addNotification({
                  type: 'system',
                  title: 'Nueva notificación',
                  message: 'Esta es una notificación de prueba creada desde el dashboard',
                  link: '/dashboard'
                })}
              >
                Crear notificación de prueba
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center border border-dashed rounded-lg">
                <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                <h3 className="font-medium mb-1">No hay eventos programados</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Programa un evento para verlo aquí
                </p>
                <Button asChild size="sm">
                  <Link to="/calendar">Ir al Calendario</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
