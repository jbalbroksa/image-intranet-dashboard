
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanies } from '@/hooks/use-companies';
import { Textarea } from '@/components/ui/textarea';

export function CreateCompanyForm() {
  const navigate = useNavigate();
  const { createCompany, isLoading } = useCompanies();
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    agentAccessUrl: '',
    contactEmail: '',
    classification: 'Estándar',
    specifications: []
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createCompany({
      name: formData.name,
      website: formData.website || undefined,
      agentAccessUrl: formData.agentAccessUrl || undefined,
      contactEmail: formData.contactEmail || undefined,
      classification: formData.classification,
      specifications: formData.specifications.length > 0 ? formData.specifications : undefined
    }, {
      onSuccess: () => {
        navigate('/companies');
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <SelectItem value="Estándar">Estándar</SelectItem>
              <SelectItem value="Básica">Básica</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => navigate('/companies')}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Compañía'}
        </Button>
      </div>
    </form>
  );
}
