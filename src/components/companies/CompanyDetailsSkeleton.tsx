
import { Skeleton } from '@/components/ui/skeleton';

export function CompanyDetailsSkeleton() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-md" />
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-md" />
        <Skeleton className="h-64 rounded-md" />
      </div>
    </div>
  );
}
