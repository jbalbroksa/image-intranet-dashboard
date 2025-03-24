
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ProductCategory, Product } from '@/types';

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
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<Product>;
  categories?: ProductCategory[];
  isEdit?: boolean;
  companies?: { id: string; name: string }[];
}

export function ProductForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  categories = [],
  companies = [],
  isEdit = false 
}: ProductFormProps) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del producto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compañía</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="">Selecciona una compañía</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="strengths">Fortalezas</TabsTrigger>
            <TabsTrigger value="weaknesses">Debilidades</TabsTrigger>
            <TabsTrigger value="processes">Procesos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción General</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción general del producto" 
                      className="resize-none min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Proporciona una descripción general del producto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="strengths">
            <FormField
              control={form.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fortalezas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Principales fortalezas del producto" 
                      className="resize-none min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detalla las principales fortalezas y ventajas del producto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="weaknesses">
            <FormField
              control={form.control}
              name="weaknesses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debilidades</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Principales debilidades o limitaciones" 
                      className="resize-none min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detalla las principales limitaciones o debilidades del producto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="processes">
            <FormField
              control={form.control}
              name="processes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procesos</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Procesos relacionados con el producto" 
                      className="resize-none min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detalla los procesos relacionados con este producto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
