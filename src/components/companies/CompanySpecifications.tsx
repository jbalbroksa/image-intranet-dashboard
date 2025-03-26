
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditSpecificationForm } from './EditSpecificationForm';
import { Company } from '@/types';

interface CompanySpecificationsProps {
  company: Company;
}

export function CompanySpecifications({ company }: CompanySpecificationsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Especificaciones Particulares</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-1">
          {company.specifications && company.specifications.map((spec) => (
            <div key={spec.id} className="py-3 border-b last:border-0">
              <h3 className="font-medium mb-1">{spec.category}</h3>
              <EditSpecificationForm
                specification={spec}
                companyId={company.id}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
