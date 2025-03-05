
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 py-3 px-4 shadow-md", className)}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <h1 className="font-pixel text-xl md:text-2xl text-center md:text-left text-yellow-900 drop-shadow-sm transform hover:scale-105 transition-transform duration-300 ease-in-out">
            The Million Pixel Homepage™
          </h1>
        </div>
        <div className="font-retro flex flex-col sm:flex-row items-center gap-2 text-yellow-900 text-lg">
          <span className="animate-bounce-subtle">1,000,000 pixels</span>
          <span className="hidden sm:inline">•</span>
          <span className="animate-float">$1 per pixel</span>
          <span className="hidden sm:inline">•</span>
          <span className="animate-pulse">Own a piece of internet history!</span>
        </div>
        <div className="relative">
          <div className="bg-red-600 text-white font-pixel text-xs px-4 py-2 rounded-md transform rotate-3 border-2 border-white shadow-lg">
            <span className="animate-blink">SOLD OUT!</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
