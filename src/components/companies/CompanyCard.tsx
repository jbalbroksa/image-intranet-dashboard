
import { Link } from 'react-router-dom';
import { Building2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link 
      key={company.id}
      to={`/companies/${company.id}`}
      className="block"
    >
      <Card className="h-full card-hover">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {company.logo ? (
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="h-12 w-12 object-contain bg-white p-1 rounded-md border"
                />
              ) : (
                <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base">{company.name}</h3>
                  <Badge variant={company.classification === 'Preferente' ? 'default' : 'outline'}>
                    {company.classification}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-sm text-muted-foreground">{company.website}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Email del responsable:</p>
              <p className={!company.contactEmail ? 'italic text-muted-foreground' : ''}>
                {company.contactEmail || 'No disponible'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Última actualización:</p>
              <p>{new Date(company.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
