
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Frequency } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const isFrequencyPage = location.pathname === '/frequency';
  const isComponentPage = location.pathname === '/';

  return (
    <div className="bg-background shadow-sm">
      <div className="container mx-auto py-2">
        <div className="flex justify-center gap-4">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isComponentPage 
                ? 'bg-primary text-white' 
                : 'hover:bg-muted'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Component Calculator</span>
          </Link>
          
          <Link 
            to="/frequency" 
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isFrequencyPage 
                ? 'bg-primary text-white' 
                : 'hover:bg-muted'
            }`}
          >
            <Frequency className="w-4 h-4" />
            <span>Frequency Calculator</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
