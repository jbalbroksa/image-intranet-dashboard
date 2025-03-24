
import { z } from "zod";

// Form schema for category
const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  parentId: z.string().optional(),
  description: z.string().optional(),
});

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

export interface ProductsProps {}

const Products = () => {
  return (
    <div>
      <h1>Products</h1>
    </div>
  );
};

export default Products;
