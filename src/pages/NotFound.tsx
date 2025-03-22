
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center px-6">
        <div className="mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-lg bg-muted mb-4">
            <span className="text-4xl font-bold">404</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Página no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Button asChild className="gap-2">
            <Link to="/">
              <HomeIcon className="h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
        </div>
        
        <div className="border-t border-border pt-6 text-sm text-muted-foreground">
          <p>Si crees que esto es un error, por favor contacta con el administrador del sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
