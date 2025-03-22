
import { Menu, BellDot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/NotificationBell';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 z-30 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu size={20} />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="hidden md:flex md:items-center md:gap-2">
          <h2 className="text-lg font-medium text-foreground">ConectaSeguros</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <NotificationBell />

          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings size={20} />
            <span className="sr-only">Settings</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-muted-foreground">{user?.type || 'Administrador'}</p>
          </div>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user?.avatar} alt={user?.name || 'Avatar'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
