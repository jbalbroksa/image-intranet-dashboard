
export type UserRole = 'admin' | 'manager' | 'delegate' | 'employee' | 'collaborator';

export type UserType = 'Administrador' | 'Responsable de Departamento' | 'Delegación' | 'Empleado SSCC' | 'Colaborador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  type: UserType;
  avatar?: string;
  branchId?: string;
  position?: string;
  extension?: string;
  socialContact?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  agentAccessUrl?: string;
  contactEmail?: string;
  classification?: string;
  createdAt: string;
  lastUpdated: string;
  specifications?: CompanySpecification[];
}

export interface CompanySpecification {
  id: string;
  category: string;
  content: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId?: string;
  subcategories?: ProductCategory[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId?: string;
  companyId: string;
  description?: string;
  status: 'draft' | 'published';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  companyId?: string;
  productCategoryId?: string;
  productSubcategoryId?: string;
  productId?: string;
  tags?: string[];
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured: boolean;
  coverImage?: string;
  category: string;
  companyId?: string;
  tags?: string[];
  author: string;
  publishedAt: string;
}

export interface Notification {
  id: string;
  type: 'document' | 'product' | 'company' | 'news' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  category: string;
}
