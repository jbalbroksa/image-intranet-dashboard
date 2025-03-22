
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/types';
import { useCompanies } from '@/hooks/use-companies';

interface EditCompanyFormProps {
  company: Company;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditCompanyForm({ company, onSuccess, onCancel }: EditCompanyFormProps) {
  const { updateCompany, isLoading } = useCompanies();
  const [formData, setFormData] = useState({
    name: company.name,
    website: company.website || '',
    agentAccessUrl: company.agentAccessUrl || '',
    contactEmail: company.contactEmail || '',
    classification: company.classification || 'Standard'
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany({
      id: company.id,
      ...formData
    });
    onSuccess();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Compañía *</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Sitio Web</Label>
          <Input 
            id="website" 
            value={formData.website} 
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="ejemplo.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="agentAccessUrl">URL de Acceso para Mediadores</Label>
          <Input 
            id="agentAccessUrl" 
            value={formData.agentAccessUrl} 
            onChange={(e) => handleChange('agentAccessUrl', e.target.value)}
            placeholder="acceso.ejemplo.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email de Contacto</Label>
          <Input 
            id="contactEmail" 
            type="email"
            value={formData.contactEmail} 
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            placeholder="contacto@ejemplo.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="classification">Clasificación</Label>
          <Select 
            value={formData.classification} 
            onValueChange={(value) => handleChange('classification', value)}
          >
            <SelectTrigger id="classification">
              <SelectValue placeholder="Seleccione una clasificación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Preferente">Preferente</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Básica">Básica</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
  );
}
