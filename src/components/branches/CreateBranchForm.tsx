
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBranches } from '@/hooks/use-branches';

interface CreateBranchFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateBranchForm({ onSuccess, onCancel }: CreateBranchFormProps) {
  const { createBranch, isLoading } = useBranches();
  
  const [branchData, setBranchData] = useState({
    name: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: ''
  });

  const handleChange = (field: string, value: string) => {
    setBranchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createBranch({
      name: branchData.name,
      address: branchData.address,
      postalCode: branchData.postalCode,
      city: branchData.city,
      province: branchData.province,
      contactPerson: branchData.contactPerson,
      email: branchData.email,
      phone: branchData.phone || undefined,
      website: branchData.website || undefined
    }, {
      onSuccess
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input 
              id="name" 
              placeholder="Nombre de la sucursal" 
              required 
              value={branchData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Persona de Contacto *</Label>
            <Input 
              id="contactPerson" 
              placeholder="Nombre y apellidos" 
              required
              value={branchData.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Dirección *</Label>
          <Input 
            id="address" 
            placeholder="Calle, número, piso..." 
            required
            value={branchData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Código Postal *</Label>
            <Input 
              id="postalCode" 
              placeholder="Ej: 28001" 
              required
              value={branchData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Localidad *</Label>
            <Input 
              id="city" 
              placeholder="Ej: Madrid" 
              required
              value={branchData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">Provincia *</Label>
            <Input 
              id="province" 
              placeholder="Ej: Madrid" 
              required
              value={branchData.province}
              onChange={(e) => handleChange('province', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="correo@ejemplo.com"
              required
              value={branchData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input 
              id="phone" 
              placeholder="Ej: 912345678"
              value={branchData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Página Web</Label>
            <Input 
              id="website" 
              placeholder="Ej: https://www.ejemplo.com"
              value={branchData.website}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
