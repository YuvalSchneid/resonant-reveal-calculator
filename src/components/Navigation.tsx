
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Clock, ZapIcon } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const isFrequencyPage = location.pathname === '/frequency';
  const isComponentPage = location.pathname === '/';

  return (
    <div className="bg-background shadow-sm">
      <div className="container mx-auto py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Text in top left */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-full p-1.5">
              <ZapIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <h2 className="text-sm font-semibold text-indigo-700">Projecton Yuval & Yarin</h2>
              <p className="text-xs text-muted-foreground">Electrical Engineering Lab || May 2025</p>
            </div>
          </div>

          {/* Navigation Links */}
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
              <Clock className="w-4 h-4" />
              <span>Frequency Calculator</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
