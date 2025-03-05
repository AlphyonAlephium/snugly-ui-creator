
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-xl px-4">
          <div className="font-pixel text-8xl text-red-600 mb-6 animate-bounce-subtle">404</div>
          <h1 className="font-pixel text-3xl text-gray-800 mb-4">Pixel Not Found</h1>
          <p className="font-retro text-xl text-gray-600 mb-8">
            Oops! It seems the pixel advertisement you're looking for has gone missing in the grid.
          </p>
          <a 
            href="/" 
            className="font-retro bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-3 rounded-md shadow-md transition-all duration-300 inline-block transform hover:-translate-y-1"
          >
            Return to Homepage
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
