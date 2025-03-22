
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center px-6">
        <h1 className="text-4xl font-bold mb-4">ConectaSeguros</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Bienvenido a la intranet de gestión interna
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/dashboard">
            Acceder al Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
