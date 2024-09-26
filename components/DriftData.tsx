// /components/DriftData.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define the structure of market data
interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  openInterest: number;
}

export default function DriftData() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch market data on component mount
  useEffect(() => {
    const fetchDriftData = async () => {
      try {
        const response = await fetch('/api/drift-data');
        if (!response.ok) {
          throw new Error('Failed to fetch Drift data');
        }
        const data = await response.json();
        setMarketData(data.markets);
      } catch (error) {
        console.error('Error fetching Drift data:', error);
        setError('Failed to fetch Drift data. Please try again later.');
      }
    };

    fetchDriftData();
  }, []);

  // Update mouse position for light effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 relative">
      {/* Mouse light effect */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />

      <h2 className="text-2xl font-bold mb-4 text-blue-600">Drift Perpetual Markets</h2>
      {marketData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData.map((market, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-2 text-blue-500">{market.symbol}</h3>
              <p className="text-gray-600 dark:text-gray-300">Price: <span className="font-bold text-green-500">${market.price.toFixed(2)}</span></p>
              <p className="text-gray-600 dark:text-gray-300">24h Volume: <span className="font-bold text-purple-500">${market.volume24h.toLocaleString()}</span></p>
              <p className="text-gray-600 dark:text-gray-300">Open Interest: <span className="font-bold text-orange-500">{market.openInterest.toLocaleString()}</span></p>
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                PERP
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Loading market data...</p>
      )}
    </div>
  );
}
