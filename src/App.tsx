
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Companies from "@/pages/Companies";
import CompanyDetails from "@/pages/CompanyDetails";
import Documents from "@/pages/Documents";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import Branches from "@/pages/Branches";
import Users from "@/pages/Users";
import UserDetail from "@/pages/UserDetail";
import News from "@/pages/News";
import Calendar from "@/pages/Calendar";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/news" element={<News />} />
                <Route path="/calendar" element={<Calendar />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
