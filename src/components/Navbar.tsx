
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, MessageSquare, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 ${
          isActive 
            ? 'bg-educator-accent text-white' 
            : 'text-educator-dark hover:bg-educator-gray'
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="text-educator-dark font-medium text-xl mr-8">Insightful Educator</span>
            
            {!isMobile && (
              <div className="flex space-x-2">
                <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
                <NavLink to="/analytics" icon={BarChart2} label="Analytics" />
                <NavLink to="/feedback" icon={MessageSquare} label="Feedback" />
              </div>
            )}
          </div>
          
          {isMobile && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="bg-white/95 backdrop-blur-md animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-2">
            <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/analytics" icon={BarChart2} label="Analytics" />
            <NavLink to="/feedback" icon={MessageSquare} label="Feedback" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
