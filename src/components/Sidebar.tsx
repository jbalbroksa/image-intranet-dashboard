
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PackageSearch, 
  Building2, 
  MapPin, 
  Users, 
  CalendarDays, 
  Newspaper,
  Settings,
  HelpCircle,
  BarChart3,
  Search,
  FolderArchive,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuth();

  const mainMenuItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/' },
    { icon: LayoutDashboard, label: 'Panel', path: '/dashboard' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
    { icon: PackageSearch, label: 'Productos', path: '/products' },
    { icon: Building2, label: 'Compañías', path: '/companies' },
    { icon: MapPin, label: 'Sucursales', path: '/branches' },
    { icon: Users, label: 'Usuarios', path: '/users' },
    { icon: CalendarDays, label: 'Calendario', path: '/calendar' },
    { icon: Newspaper, label: 'Noticias', path: '/news' },
  ];

  const quickAccessItems = [
    { icon: ShieldCheck, label: 'Portal de Gestión', path: '/management-portal' },
    { icon: Search, label: 'Buscador de Productos', path: '/product-search' },
    { icon: HelpCircle, label: 'Centro de Soporte', path: '/support' },
    { icon: BarChart3, label: 'Informes y Estadísticas', path: '/reports' },
  ];

  const footerMenuItems = [
    { icon: Settings, label: 'Configuración', path: '/settings' },
    { icon: HelpCircle, label: 'Ayuda', path: '/help' },
  ];

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => (
    <NavLink 
      to={path}
      onClick={onClose}
      className={({ isActive }) => 
        `sidebar-item ${isActive ? 'active' : ''}`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo and platform name */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg">
          C
        </div>
        <div>
          <h1 className="font-semibold text-foreground">ConectaSeguros</h1>
          <p className="text-xs text-muted-foreground">Plataforma Intranet de Franquicia</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col justify-between">
        <div className="space-y-8 px-3">
          <nav className="space-y-1">
            {mainMenuItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </nav>

          <div>
            <h2 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Acceso Rápido
            </h2>
            <nav className="space-y-1">
              {quickAccessItems.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-auto px-3">
          <nav className="space-y-1">
            {footerMenuItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
