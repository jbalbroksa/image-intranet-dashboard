
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 lg:relative transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 w-64 lg:w-72 bg-sidebar flex-shrink-0 border-r border-border`}
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={() => setSidebarOpen(prev => !prev)} 
          sidebarOpen={sidebarOpen} 
        />
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
