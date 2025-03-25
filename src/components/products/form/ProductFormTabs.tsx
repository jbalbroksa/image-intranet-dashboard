
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ProductFormTabs() {
  const form = useFormContext();
  
  return (
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
  );
}
