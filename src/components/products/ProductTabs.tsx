
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductEmptyState } from './ProductEmptyState';

interface ProductTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  description?: string;
  onEdit: () => void;
}

export function ProductTabs({ activeTab, onTabChange, description, onEdit }: ProductTabsProps) {
  const renderEmptyState = (type: string, title: string) => (
    <ProductEmptyState
      title={`No hay ${title}`}
      description={`Aún no se ${type === 'description' ? 'ha añadido una descripción' : 
                    type === 'processes' ? 'han documentado los procesos' :
                    type === 'weaknesses' ? 'han identificado debilidades' : 'han añadido observaciones'} para este producto.`}
      onEdit={onEdit}
      icon={<FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />}
    />
  );

  return (
    <Tabs defaultValue="description" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="description">Descripción</TabsTrigger>
        <TabsTrigger value="processes">Procesos</TabsTrigger>
        <TabsTrigger value="weaknesses">Debilidades</TabsTrigger>
        <TabsTrigger value="comments">Observaciones</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-6">
        {description ? (
          <div className="prose max-w-none">
            <p>{description}</p>
          </div>
        ) : (
          renderEmptyState('description', 'descripción')
        )}
      </TabsContent>

      <TabsContent value="processes" className="space-y-6">
        {renderEmptyState('processes', 'procesos definidos')}
      </TabsContent>

      <TabsContent value="weaknesses" className="space-y-6">
        {renderEmptyState('weaknesses', 'debilidades identificadas')}
      </TabsContent>

      <TabsContent value="comments" className="space-y-6">
        {renderEmptyState('comments', 'observaciones')}
      </TabsContent>
    </Tabs>
  );
}
