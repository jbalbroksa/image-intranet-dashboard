
import { useState } from 'react';
import { BellDot, Bell, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/context/NotificationContext';
import { Notification } from '@/types';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setOpen(false);
  };

  // Group notifications by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toDateString();
    let group;

    if (date === today) {
      group = 'Hoy';
    } else if (date === yesterday) {
      group = 'Ayer';
    } else {
      group = 'Anteriores';
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    
    groups[group].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  // Function to get notification icon based on type
  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'document':
        return <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />;
      case 'product':
        return <Circle className="h-3 w-3 fill-green-500 text-green-500" />;
      case 'company':
        return <Circle className="h-3 w-3 fill-violet-500 text-violet-500" />;
      case 'news':
        return <Circle className="h-3 w-3 fill-amber-500 text-amber-500" />;
      default:
        return <Circle className="h-3 w-3 fill-gray-500 text-gray-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          {unreadCount > 0 ? (
            <>
              <BellDot size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          ) : (
            <Bell size={20} />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-medium">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-8"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
        {notifications.length > 0 ? (
          <>
            <ScrollArea className="max-h-80">
              <div className="p-2">
                {Object.entries(groupedNotifications).map(([group, items]) => (
                  <div key={group} className="my-2">
                    <h4 className="text-xs font-semibold text-muted-foreground py-2 px-3">{group}</h4>
                    <div className="space-y-1">
                      {items.map((notification) => (
                        <Link
                          key={notification.id}
                          to={notification.link || '#'}
                          onClick={() => handleNotificationClick(notification)}
                          className={`flex gap-3 p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${!notification.read ? 'bg-accent/40' : ''}`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs mt-1 text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs mt-1 text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { 
                                addSuffix: true,
                                locale: es
                              })}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-border">
              <Button variant="outline" className="w-full text-sm" size="sm" asChild>
                <Link to="/notifications">Ver todas las notificaciones</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No hay notificaciones</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
