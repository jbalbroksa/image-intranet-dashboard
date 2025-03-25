
import React from "react";
import {
  Home,
  Building2,
  Package,
  FileText,
  MapPin,
  Users,
  Newspaper,
  Calendar as CalendarIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Compañías",
      href: "/companies",
      icon: Building2,
    },
    {
      title: "Productos",
      href: "/products",
      icon: Package,
    },
    {
      title: "Documentos",
      href: "/documents",
      icon: FileText,
    },
    {
      title: "Sucursales",
      href: "/branches",
      icon: MapPin,
    },
    {
      title: "Usuarios",
      href: "/users",
      icon: Users,
    },
    {
      title: "Noticias",
      href: "/news",
      icon: Newspaper,
    },
    {
      title: "Calendario",
      href: "/calendar",
      icon: CalendarIcon,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-secondary border-r border-r-muted transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 z-50`}
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-bold">Lovable</span>
        <button
          className="lg:hidden text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          X
        </button>
      </div>
      <nav className="py-6">
        <ul>
          {navigationItems.map((item) => (
            <li key={item.title} className="mb-2">
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center p-2 text-muted-foreground hover:text-foreground ${
                    isActive ? "bg-accent text-foreground font-medium" : ""
                  }`
                }
                onClick={onClose}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
