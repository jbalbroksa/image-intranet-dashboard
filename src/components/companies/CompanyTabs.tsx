
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Company } from '@/types';
import { CompanyOverview } from './CompanyOverview';
import { CompanySpecifications } from './CompanySpecifications';
import { CompanyDocuments } from './CompanyDocuments';
import { CompanyProducts } from './CompanyProducts';

interface CompanyTabsProps {
  company: Company;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function CompanyTabs({ company, activeTab, setActiveTab }: CompanyTabsProps) {
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Visión General</TabsTrigger>
        <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
        <TabsTrigger value="products">Productos</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <CompanyOverview company={company} />
      </TabsContent>

      <TabsContent value="specifications">
        <CompanySpecifications company={company} />
      </TabsContent>

      <TabsContent value="documents">
        <CompanyDocuments />
      </TabsContent>

      <TabsContent value="products">
        <CompanyProducts />
      </TabsContent>
    </Tabs>
  );
}
