
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Company } from '@/types';
import { useCompanies } from '@/hooks/use-companies';

interface EditCompanyFormProps {
  company: Company;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  website: string;
  agentAccessUrl: string;
  contactEmail: string;
  classification: string;
}

export function EditCompanyForm({ company, onSuccess, onCancel }: EditCompanyFormProps) {
  const { updateCompany, isLoading } = useCompanies();
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: company.name,
      website: company.website || '',
      agentAccessUrl: company.agentAccessUrl || '',
      contactEmail: company.contactEmail || '',
      classification: company.classification || 'Standard'
    }
  });

  const onSubmit = (values: FormValues) => {
    updateCompany({
      id: company.id,
      ...values
    });
    onSuccess();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Compañía *</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sitio Web</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="ejemplo.com"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="agentAccessUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de Acceso para Mediadores</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="acceso.ejemplo.com"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de Contacto</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    placeholder="contacto@ejemplo.com"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="classification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clasificación</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una clasificación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Preferente">Preferente</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Básica">Básica</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
