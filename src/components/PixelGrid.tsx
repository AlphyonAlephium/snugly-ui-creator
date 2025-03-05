
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
  
  return {
    type,
    text,
    color,
    textColor,
    hasBorder,
    borderColor,
    fontSize: size > 3 ? 'text-xs' : size > 2 ? 'text-[8px]' : 'text-[6px]',
    rotate: Math.random() > 0.8 ? `rotate-${Math.floor(Math.random() * 3) * 90}` : '',
  };
};

// Generate a grid of ads
const generateAds = (rows: number, cols: number, minSize = 1, maxSize = 6) => {
  const grid: any[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
  const filledCells: Record<string, boolean> = {};
  
  // Attempt to place ads of various sizes
  for (let attempts = 0; attempts < rows * cols * 2; attempts++) {
    const adWidth = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    const adHeight = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    
    const startRow = Math.floor(Math.random() * (rows - adHeight + 1));
    const startCol = Math.floor(Math.random() * (cols - adWidth + 1));
    
    // Check if all cells for this ad are available
    let canPlace = true;
    for (let r = startRow; r < startRow + adHeight; r++) {
      for (let c = startCol; c < startCol + adWidth; c++) {
        if (filledCells[`${r},${c}`]) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) break;
    }
    
    // Place the ad if possible
    if (canPlace) {
      const ad = generateRandomAd(adWidth);
      
      for (let r = startRow; r < startRow + adHeight; r++) {
        for (let c = startCol; c < startCol + adWidth; c++) {
          grid[r][c] = null; // Clear these cells first
          filledCells[`${r},${c}`] = true;
        }
      }
      
      // Only put the ad in the top-left cell of its space
      grid[startRow][startCol] = { ...ad, width: adWidth, height: adHeight };
    }
  }
  
  // Fill any remaining empty cells with 1x1 ads
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!filledCells[`${r},${c}`]) {
        grid[r][c] = { ...generateRandomAd(1), width: 1, height: 1 };
        filledCells[`${r},${c}`] = true;
      }
    }
  }
  
  return grid;
};

const PixelGrid: React.FC<PixelGridProps> = ({ className }) => {
  const [ads, setAds] = useState<any[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Responsive grid size based on screen width
  const useSmallGrid = window.innerWidth < 768;
  const gridRows = useSmallGrid ? 30 : 40;
  const gridCols = useSmallGrid ? 30 : 50;
  
  useEffect(() => {
    // Generate ads with a loading delay for animation effect
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setAds(generateAds(gridRows, gridCols));
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
        <div className="grid" style={{ 
          gridTemplateRows: `repeat(${gridRows}, minmax(5px, 1fr))`,
          gridTemplateColumns: `repeat(${gridCols}, minmax(5px, 1fr))`,
          gap: '1px'
        }}>
          {ads.map((row, rowIndex) => 
            row.map((ad, colIndex) => {
              if (!ad) return null; // Skip cells that are part of larger ads
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'overflow-hidden animate-pixel-fade flex items-center justify-center transition-transform hover:z-10 hover:scale-105 cursor-pointer',
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
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PixelGrid;
