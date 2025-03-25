
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProductFormActionsProps {
  isEdit: boolean;
  onCancel: () => void;
}

export function ProductFormActions({ isEdit, onCancel }: ProductFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
      </Button>
    </div>
  );
}
