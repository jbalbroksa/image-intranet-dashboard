
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Product } from '@/types';
import { useProducts } from '@/hooks/products/use-products';
import { useCompanies } from '@/hooks/use-companies';
import { ProductBasicFields } from './form/ProductBasicFields';
import { ProductFormTabs } from './form/ProductFormTabs';
import { ProductFormActions } from './form/ProductFormActions';

// Form schema for product
const productSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  categoryId: z.string().min(1, 'La categoría es obligatoria'),
  subcategoryId: z.string().optional(),
  companyId: z.string().min(1, 'La compañía es obligatoria'),
  description: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  processes: z.string().optional(),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ 
  initialData,
  onSuccess, 
  onCancel
}: ProductFormProps) {
  const { productCategories, createProduct, updateProduct } = useProducts();
  const { companies } = useCompanies();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      categoryId: initialData?.categoryId || '',
      subcategoryId: initialData?.subcategoryId || '',
      companyId: initialData?.companyId || '',
      description: initialData?.description || '',
      strengths: initialData?.strengths || '',
      weaknesses: initialData?.weaknesses || '',
      processes: initialData?.processes || '',
      status: initialData?.status || 'draft',
      tags: initialData?.tags || [],
    }
  });

  const handleSubmit = (values: ProductFormValues) => {
    if (initialData?.id) {
      updateProduct({
        id: initialData.id,
        ...values
      });
      onSuccess();
    } else {
      // Ensure all required fields are present
      const productData = {
        name: values.name,
        categoryId: values.categoryId,
        companyId: values.companyId,
        status: values.status,
        subcategoryId: values.subcategoryId,
        description: values.description || '',
        strengths: values.strengths || '',
        weaknesses: values.weaknesses || '',
        processes: values.processes || '',
        tags: values.tags || [],
      };
      
      createProduct(productData);
      onSuccess();
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <ProductBasicFields 
            productCategories={productCategories} 
            companies={companies} 
          />
          
          <ProductFormTabs />
          
          <ProductFormActions 
            isEdit={!!initialData?.id} 
            onCancel={onCancel} 
          />
        </form>
      </Form>
    </FormProvider>
  );
}
