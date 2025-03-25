
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProductLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="h-[200px]">
          <CardHeader className="animate-pulse bg-gray-200 h-10 rounded mb-2" />
          <CardContent className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 rounded w-2/3" />
            <div className="animate-pulse bg-gray-200 h-4 rounded w-1/2" />
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
