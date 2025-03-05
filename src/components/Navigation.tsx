
import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const navItems = [
    "Homepage", "Buy Pixels", "FAQ", "Blog", "Pixel List", 
    "Press", "Testimonials", "Contact me"
  ];
  
  return (
    <nav className={cn("w-full bg-yellow-100 py-3 px-4 border-y-2 border-yellow-800", className)}>
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <div className="flex items-center space-x-4 min-w-max px-2">
          <div className="flex items-center">
            <span className="font-retro text-blue-600 hover:text-blue-800">🔄 Follow @tew</span>
            <span className="ml-2 bg-yellow-300 px-2 py-0.5 text-xs rounded font-retro">13k followers</span>
          </div>
          <div className="h-5 border-r border-yellow-600"></div>
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href="#" 
              className="font-retro text-lg transition-all duration-200 text-yellow-900 hover:text-blue-600 hover:underline"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
