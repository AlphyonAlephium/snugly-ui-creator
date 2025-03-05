
import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full bg-yellow-100 py-4 px-4 border-t-2 border-yellow-800", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-pixel text-sm text-yellow-900 mb-2">About This Page</h3>
            <p className="font-retro text-base text-gray-700">
              A modern recreation of the iconic Million Dollar Homepage from 2005,
              where each pixel was sold for $1. A piece of internet history!
            </p>
          </div>
          
          <div>
            <h3 className="font-pixel text-sm text-yellow-900 mb-2">Quick Links</h3>
            <ul className="font-retro space-y-1">
              {["FAQ", "Terms of Service", "Privacy Policy", "Contact", "Blog"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                    → {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-pixel text-sm text-yellow-900 mb-2">Stats</h3>
            <ul className="font-retro space-y-1 text-gray-700">
              <li>Pixels Sold: <span className="font-bold text-green-600">1,000,000</span></li>
              <li>Advertisers: <span className="font-bold text-green-600">2,938</span></li>
              <li>Countries: <span className="font-bold text-green-600">84</span></li>
              <li>Created: <span className="font-bold">2005</span> (Original)</li>
              <li>Recreated: <span className="font-bold">2023</span> (This version)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-yellow-300 text-center">
          <p className="font-retro text-gray-600 text-sm">
            © 2023 The Million Pixel Homepage | A modern recreation of Alex Tew's 2005 original
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
