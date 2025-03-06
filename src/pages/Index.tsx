
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PixelGrid from '@/components/PixelGrid';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay for animation effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 overflow-hidden">
      <div className={cn(
        "transition-opacity duration-700",
        isLoaded ? "opacity-100" : "opacity-0"
      )}>
        <Header />
        <Navigation />
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-6 w-full">
            <div className="mb-6 text-center">
              <h2 className="font-pixel text-xl text-gray-800 mb-2">The Internet's Pixel Canvas</h2>
              <p className="font-retro text-lg text-gray-600 max-w-3xl mx-auto">
                Every pixel tells a story. This is a modern recreation of the iconic Million Dollar Homepage
                from 2005, where each pixel was sold for $1, creating internet history.
              </p>
            </div>
            
            <div className="mb-6 text-center">
              <h3 className="font-pixel text-lg text-gray-800 mb-2">Buy Your Pixel Space Today!</h3>
              <p className="font-retro text-gray-600 max-w-3xl mx-auto mb-2">
                Each pixel costs $1. Click on any available space to make it yours forever!
              </p>
              <div className="flex justify-center gap-2 text-sm font-retro">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 mr-1"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 mr-1"></div>
                  <span>Sold</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6 flex flex-col md:flex-row justify-center gap-4 font-retro text-lg">
              <a 
                href="#" 
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-3 rounded-md shadow-md transition-all duration-300 text-center transform hover:-translate-y-1"
              >
                How It Works
              </a>
              <a 
                href="#" 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-md shadow-md transition-all duration-300 text-center transform hover:-translate-y-1"
              >
                View Advertisers
              </a>
              <a 
                href="#" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-md shadow-md transition-all duration-300 text-center transform hover:-translate-y-1"
              >
                Read the Story
              </a>
            </div>
            
            {/* The main pixel grid */}
            <div className="border-4 border-gray-800 shadow-xl">
              <PixelGrid />
            </div>
            
            <div className="mt-6 text-center">
              <p className="font-retro text-base text-gray-700">
                Click on any available ad space to purchase it. Hover over ads to see prices and details.
              </p>
              <p className="font-retro text-sm text-gray-500 mt-2">
                Your ad will stay online forever!
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
