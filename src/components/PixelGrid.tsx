
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PixelGridProps {
  className?: string;
}

interface AdData {
  id: string;
  color: string;
  width: number;
  height: number;
  text?: string;
  type: 'text' | 'image' | 'banner';
  hasBorder?: boolean;
  borderColor?: string;
  purchased?: boolean;
  owner?: string;
  logo?: string;
  website?: string;
}

// Generate random advertisement content
const generateRandomAd = (size: number, row: number, col: number): AdData => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-rose-500',
  ];
  
  const types = ['text', 'image', 'banner'];
  const type = types[Math.floor(Math.random() * types.length)] as 'text' | 'image' | 'banner';
  
  const words = [
    'BUY NOW', 'CLICK HERE', 'FREE', 'NEW', 'HOT', 'SALE', 'WIN', 'POKER', 
    'CASINO', 'SHOP', 'DIET', 'CHEAP', 'BEST', 'TRAVEL', 'HOSTING', 'LOANS',
    'GAMES', 'JOBS', 'PILLS', 'XXX', 'MUSIC', 'DOWNLOAD', 'SPORTS', 'DATING'
  ];
  
  // For text ads
  const text = size > 2 ? words[Math.floor(Math.random() * words.length)] : '';
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // For image ads (simplified)
  const hasBorder = Math.random() > 0.7;
  const borderColor = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    id: `${row}-${col}`,
    type,
    text,
    color,
    hasBorder,
    borderColor,
    width: size,
    height: size,
    purchased: false
  };
};

// Generate a grid of ads
const generateAds = (rows: number, cols: number, minSize = 1, maxSize = 6) => {
  const grid: AdData[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
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
      const ad = generateRandomAd(adWidth, startRow, startCol);
      
      for (let r = startRow; r < startRow + adHeight; r++) {
        for (let c = startCol; c < startCol + adWidth; c++) {
          grid[r][c] = null; // Clear these cells first
          filledCells[`${r},${c}`] = true;
        }
      }
      
      // Only put the ad in the top-left cell of its space
      grid[startRow][startCol] = ad;
    }
  }
  
  // Fill any remaining empty cells with 1x1 ads
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!filledCells[`${r},${c}`]) {
        grid[r][c] = generateRandomAd(1, r, c);
        filledCells[`${r},${c}`] = true;
      }
    }
  }
  
  return grid;
};

const PixelGrid: React.FC<PixelGridProps> = ({ className }) => {
  const [ads, setAds] = useState<AdData[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<AdData | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { toast } = useToast();
  
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

  const handleAdClick = (ad: AdData) => {
    if (ad.purchased) {
      toast({
        title: "This space is already purchased",
        description: `This ${ad.width}x${ad.height} pixel space belongs to ${ad.owner || 'someone else'}.`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedAd(ad);
    setShowPurchaseModal(true);
  };

  const handlePurchaseComplete = (ad: AdData, adData: { owner: string, logo?: string, website?: string }) => {
    // Update the ad data in our grid
    setAds(prevAds => {
      const newAds = [...prevAds];
      
      // Find the ad in the grid and update it
      for (let r = 0; r < newAds.length; r++) {
        for (let c = 0; c < newAds[r].length; c++) {
          if (newAds[r][c]?.id === ad.id) {
            newAds[r][c] = {
              ...newAds[r][c],
              purchased: true,
              owner: adData.owner,
              logo: adData.logo,
              website: adData.website,
              text: adData.website // Show the website as text
            };
            break;
          }
        }
      }
      
      return newAds;
    });
    
    setShowPurchaseModal(false);
    setSelectedAd(null);
    
    toast({
      title: "Congratulations!",
      description: `You've purchased a ${ad.width}x${ad.height} pixel ad space for $${ad.width * ad.height}!`,
    });
  };
  
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
              
              const price = ad.width * ad.height;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'overflow-hidden animate-pixel-fade flex items-center justify-center transition-transform hover:z-10 hover:scale-105 cursor-pointer relative group',
                    ad.color,
                    ad.hasBorder ? `border-2 border-${ad.borderColor}` : '',
                    ad.purchased ? 'ring-2 ring-white' : ''
                  )}
                  style={{
                    gridRow: `span ${ad.height}`,
                    gridColumn: `span ${ad.width}`,
                    animation: `pixel-fade 0.3s ease-in-out ${(rowIndex + colIndex) * 0.01}s`,
                  }}
                  onClick={() => handleAdClick(ad)}
                >
                  {ad.purchased && ad.logo ? (
                    <img 
                      src={ad.logo} 
                      alt={ad.owner || 'Advertisement'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    ad.type === 'text' && ad.text && (
                      <div className={cn(
                        'font-retro font-bold tracking-tight leading-none text-center',
                        'text-white',
                        ad.width > 3 ? 'text-xs' : ad.width > 2 ? 'text-[8px]' : 'text-[6px]'
                      )}>
                        {ad.text}
                      </div>
                    )
                  )}
                  
                  {/* Price tooltip on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
                    <span className="text-white font-retro text-xs">${price}</span>
                    <span className="text-white font-retro text-[8px]">{ad.width}x{ad.height}</span>
                    {ad.purchased ? (
                      <span className="text-red-400 font-retro text-[8px]">SOLD</span>
                    ) : (
                      <span className="text-green-400 font-retro text-[8px]">AVAILABLE</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      
      {showPurchaseModal && selectedAd && (
        <AdPurchaseModal 
          ad={selectedAd} 
          onClose={() => setShowPurchaseModal(false)}
          onPurchase={handlePurchaseComplete}
        />
      )}
    </div>
  );
};

// Ad Purchase Modal Component
interface AdPurchaseModalProps {
  ad: AdData;
  onClose: () => void;
  onPurchase: (ad: AdData, data: { owner: string, logo?: string, website?: string }) => void;
}

const AdPurchaseModal: React.FC<AdPurchaseModalProps> = ({ ad, onClose, onPurchase }) => {
  const [owner, setOwner] = useState('');
  const [website, setWebsite] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const { toast } = useToast();
  
  const price = ad.width * ad.height;
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check if the file is too large (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!owner.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name or company name",
        variant: "destructive"
      });
      return;
    }
    
    if (!website.trim()) {
      toast({
        title: "Website required",
        description: "Please enter your website URL",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would process payment here
    
    // Simulate a successful purchase
    onPurchase(ad, {
      owner,
      logo: logo || undefined,
      website
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-retro mb-4 text-center">Buy Ad Space</h2>
        
        <div className="mb-4 text-center">
          <div className="font-bold">Size: {ad.width}x{ad.height} pixels</div>
          <div className="text-xl font-bold text-green-600">${price}</div>
          <div className="text-sm text-gray-500">$1 per pixel</div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Your Name / Company</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="John Doe / Acme Corp"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://example.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Logo / Image</label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full"
              accept="image/*"
            />
            {logo && (
              <div className="mt-2 border rounded p-2">
                <img src={logo} alt="Preview" className="max-h-20 mx-auto" />
              </div>
            )}
          </div>
          
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Purchase Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PixelGrid;
