
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCompanies } from '@/hooks/use-companies';
import { CompanyDetailsHeader } from '@/components/companies/CompanyDetailsHeader';
import { CompanyTabs } from '@/components/companies/CompanyTabs';
import { CompanyDetailsSkeleton } from '@/components/companies/CompanyDetailsSkeleton';
import { CompanyNotFound } from '@/components/companies/CompanyNotFound';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { 
    getCompany,
    deleteCompany,
    isLoading
  } = useCompanies();
  
  const [company, setCompany] = useState<any>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  
  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;
      setIsLoadingCompany(true);
      try {
        const companyData = await getCompany(id);
        console.log('Fetched company data:', companyData);
        setCompany(companyData);
      } catch (error) {
        console.error('Error fetching company:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la compañía",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCompany(false);
      }
    };
    
    fetchCompany();
  }, [id, getCompany, toast]);
  
  const handleDelete = () => {
    if (!id) return;
    
    deleteCompany(id);
    toast({
      title: "Compañía eliminada",
      description: "La compañía ha sido eliminada correctamente"
    });
    navigate('/companies');
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Cambios guardados",
      description: "La información de la compañía ha sido actualizada"
    });
  };

  if (isLoadingCompany) {
    return <CompanyDetailsSkeleton />;
  }

  if (!company) {
    return <CompanyNotFound id={id} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/companies">Compañías</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{company.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <CompanyDetailsHeader 
        company={company}
        onEdit={handleEditSuccess}
        onDelete={handleDelete}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
      />

      <CompanyTabs 
        company={company}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
