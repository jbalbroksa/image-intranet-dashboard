
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Company } from '@/types';

interface CompanyOverviewProps {
  company: Company;
}

// Utilizamos datos de prueba para los documentos
const MOCK_DOCUMENTS = [
  { id: 'doc-1', title: 'Condiciones Generales', type: 'PDF', size: '1.2 MB', date: '2023-03-15' },
  { id: 'doc-2', title: 'Procedimientos de Tramitación', type: 'DOCX', size: '850 KB', date: '2023-02-28' }
];

export function CompanyOverview({ company }: CompanyOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Sitio Web</p>
            <p>{company.website || 'No disponible'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email del Responsable</p>
            <p>{company.contactEmail || 'No disponible'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">URL de Acceso para Mediadores</p>
            <p>{company.agentAccessUrl || 'No disponible'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Clasificación</p>
            <p>{company.classification || 'No especificada'}</p>
          </div>
          <Separator />
          <div className="pt-2">
            <p className="text-sm font-medium text-muted-foreground">Última actualización</p>
            <p>{new Date(company.lastUpdated).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Documentos Relacionados</CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_DOCUMENTS.length > 0 ? (
            <div className="space-y-3">
              {MOCK_DOCUMENTS.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{doc.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border border-dashed rounded-lg">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
              <h3 className="font-medium mb-1">No hay documentos</h3>
              <p className="text-sm text-muted-foreground mb-3">
                No se han añadido documentos para esta compañía.
              </p>
              <Button asChild size="sm">
                <Link to="/documents/upload">Añadir Documento</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
