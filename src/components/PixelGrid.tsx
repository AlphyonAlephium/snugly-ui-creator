
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PixelGridProps {
  className?: string;
}

// Generate random advertisement content
const generateRandomAd = (size: number) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-rose-500',
  ];
  
  const types = ['text', 'image', 'banner'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const words = [
    'BUY NOW', 'CLICK HERE', 'FREE', 'NEW', 'HOT', 'SALE', 'WIN', 'POKER', 
    'CASINO', 'SHOP', 'DIET', 'CHEAP', 'BEST', 'TRAVEL', 'HOSTING', 'LOANS',
    'GAMES', 'JOBS', 'PILLS', 'XXX', 'MUSIC', 'DOWNLOAD', 'SPORTS', 'DATING'
  ];
  
  // For text ads
  const text = size > 2 ? words[Math.floor(Math.random() * words.length)] : '';
  const color = colors[Math.floor(Math.random() * colors.length)];
  const textColor = ['bg-red-500', 'bg-yellow-500', 'bg-orange-500'].includes(color) ? 'text-white' : 'text-white';
  
  // For image ads (simplified)
  const hasBorder = Math.random() > 0.7;
  const borderColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Calculate price based on pixel count (size² * $0.10)
  const pixelCount = size * size;
  const price = pixelCount * 0.1; // $0.10 per pixel
  
  return {
    type,
    text,
    color,
    textColor,
    hasBorder,
    borderColor,
    fontSize: size > 3 ? 'text-xs' : size > 2 ? 'text-[8px]' : 'text-[6px]',
    rotate: Math.random() > 0.8 ? `rotate-${Math.floor(Math.random() * 3) * 90}` : '',
    price: price,
    pixelCount
  };
};

// Generate a grid of ads - improved to ensure no overlap
const generateAds = (rows: number, cols: number, minSize = 1, maxSize = 4) => {
  // Initialize empty grid
  const grid: any[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
  
  // Track which cells are already filled
  const filledCells: boolean[][] = Array(rows).fill(false).map(() => Array(cols).fill(false));
  
  // First place larger ads
  for (let size = maxSize; size >= minSize; size--) {
    // More attempts for smaller sizes
    const attempts = size === 1 ? rows * cols : rows * cols / size;
    
    for (let attempt = 0; attempt < attempts; attempt++) {
      // For size=1 ads, try to fill any remaining empty spaces
      if (size === 1) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (!filledCells[r][c]) {
              const ad = generateRandomAd(1);
              grid[r][c] = { ...ad, width: 1, height: 1 };
              filledCells[r][c] = true;
            }
          }
        }
        continue;
      }
      
      // Try to place a larger ad
      const startRow = Math.floor(Math.random() * (rows - size + 1));
      const startCol = Math.floor(Math.random() * (cols - size + 1));
      
      // Check if all cells in this square are available
      let canPlace = true;
      for (let r = startRow; r < startRow + size; r++) {
        for (let c = startCol; c < startCol + size; c++) {
          if (filledCells[r][c]) {
            canPlace = false;
            break;
          }
        }
        if (!canPlace) break;
      }
      
      // Place the ad if possible
      if (canPlace) {
        const ad = generateRandomAd(size);
        grid[startRow][startCol] = { ...ad, width: size, height: size };
        
        // Mark all cells in this square as filled
        for (let r = startRow; r < startRow + size; r++) {
          for (let c = startCol; c < startCol + size; c++) {
            filledCells[r][c] = true;
          }
        }
      }
    }
  }
  
  return grid;
};

const PixelGrid: React.FC<PixelGridProps> = ({ className }) => {
  const [ads, setAds] = useState<any[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPixels, setTotalPixels] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  
  // Responsive grid size based on screen width
  const useSmallGrid = window.innerWidth < 768;
  const gridRows = useSmallGrid ? 30 : 40;
  const gridCols = useSmallGrid ? 30 : 50;
  
  useEffect(() => {
    // Generate ads with a loading delay for animation effect
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const generatedAds = generateAds(gridRows, gridCols);
      setAds(generatedAds);
      
      // Calculate stats
      let pixels = 0;
      let value = 0;
      
      // Count filled cells and their value
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const ad = generatedAds[r][c];
          if (ad && ad.pixelCount) {
            pixels += 1; // Count this pixel
            value += 0.1; // $0.10 per pixel
          }
        }
      }
      
      setTotalPixels(pixels);
      setTotalValue(parseFloat(value.toFixed(2)));
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [gridRows, gridCols]);
  
  return (
    <div className={cn("w-full overflow-hidden bg-gray-200 p-1", className)}>
      {isLoading ? (
        <div className="flex justify-center items-center h-[500px]">
          <div className="font-pixel text-xl text-gray-700 animate-pulse">Loading pixel grid...</div>
        </div>
      ) : (
        <>
          <div className="grid" style={{ 
            gridTemplateRows: `repeat(${gridRows}, minmax(5px, 1fr))`,
            gridTemplateColumns: `repeat(${gridCols}, minmax(5px, 1fr))`,
            gap: '1px'
          }}>
            {ads.map((row, rowIndex) => 
              row.map((ad, colIndex) => {
                if (!ad) return null; // Skip cells that don't have ads
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      'overflow-hidden animate-pixel-fade flex items-center justify-center transition-transform hover:z-10 hover:scale-105 cursor-pointer relative group',
                      ad.color,
                      ad.hasBorder ? `border-2 border-${ad.borderColor}` : '',
                      ad.rotate
                    )}
                    style={{
                      gridRow: `span ${ad.height}`,
                      gridColumn: `span ${ad.width}`,
                      animation: `pixel-fade 0.3s ease-in-out ${(rowIndex + colIndex) * 0.01}s`,
                    }}
                  >
                    {ad.type === 'text' && ad.text && (
                      <div className={cn(
                        'font-retro font-bold tracking-tight leading-none text-center',
                        ad.textColor,
                        ad.fontSize
                      )}>
                        {ad.text}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-70 text-white text-[6px] p-0.5 transition-opacity">
                      ${ad.price.toFixed(2)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="flex justify-between mt-2 text-xs font-retro text-gray-700">
            <div>Total Pixels: {totalPixels.toLocaleString()}</div>
            <div>Total Value: ${totalValue.toLocaleString()}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default PixelGrid;
