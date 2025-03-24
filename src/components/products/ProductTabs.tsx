
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductEmptyState } from './ProductEmptyState';
import { useState } from 'react';
import { Product } from '@/types';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderEmptyState = (type: string, title: string) => (
    <ProductEmptyState
      title={`No hay ${title}`}
      description={`Aún no se ${type === 'description' ? 'ha añadido una descripción' : 
                    type === 'processes' ? 'han documentado los procesos' :
                    type === 'weaknesses' ? 'han identificado debilidades' : 'han añadido observaciones'} para este producto.`}
      onEdit={() => console.log('Edit product details')}
      icon={<FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />}
    />
  );

  return (
    <Tabs defaultValue="description" value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="description">Descripción</TabsTrigger>
        <TabsTrigger value="processes">Procesos</TabsTrigger>
        <TabsTrigger value="weaknesses">Debilidades</TabsTrigger>
        <TabsTrigger value="comments">Observaciones</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-6">
        {product.description ? (
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>
        ) : (
          renderEmptyState('description', 'descripción')
        )}
      </TabsContent>

      <TabsContent value="processes" className="space-y-6">
        {product.processes ? (
          <div className="prose max-w-none">
            <p>{product.processes}</p>
          </div>
        ) : (
          renderEmptyState('processes', 'procesos definidos')
        )}
      </TabsContent>

      <TabsContent value="weaknesses" className="space-y-6">
        {product.weaknesses ? (
          <div className="prose max-w-none">
            <p>{product.weaknesses}</p>
          </div>
        ) : (
          renderEmptyState('weaknesses', 'debilidades identificadas')
        )}
      </TabsContent>

      <TabsContent value="comments" className="space-y-6">
        {renderEmptyState('comments', 'observaciones')}
      </TabsContent>
    </Tabs>
  );
}
