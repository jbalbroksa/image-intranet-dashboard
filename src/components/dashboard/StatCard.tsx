
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

export default function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            
            {trend && (
              <div className="flex items-center mt-2">
                <span 
                  className={`inline-flex items-center text-xs font-medium ${
                    trend.positive ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {trend.positive ? '↑' : '↓'} {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-2">{trend.label}</span>
              </div>
            )}
          </div>
          
          <div className="p-2 rounded-md bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
