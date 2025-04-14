import React, { useEffect, useState, useRef } from 'react';
import { FaSearch, FaUsers, FaNetworkWired, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-20 sm:py-32 relative overflow-hidden" style={{ backgroundColor: '#f3eee5' }}>
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYuMjUgMzUuMjVhMi4yNSAyLjI1IDAgMTAwLTQuNSAyLjI1IDIuMjUgMCAwMDAgNC41eiIgZmlsbD0iIzI1MWMxYSIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-20"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#251c1a]/5 via-transparent to-[#3a2e2b]/5"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left side with logo and text */}
          <div className="lg:col-span-6 flex flex-col items-center text-center">
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#251c1a] via-[#3a2e2b] to-[#251c1a] bg-clip-text text-transparent relative inline-block">
                  A
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-[#251c1a]/20 via-[#3a2e2b]/20 to-[#251c1a]/20 blur-xl"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </span>
                <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#251c1a] via-[#3a2e2b] to-[#251c1a] bg-clip-text text-transparent relative inline-block">
                  roha
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-[#251c1a]/20 via-[#3a2e2b]/20 to-[#251c1a]/20 blur-xl"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2
                    }}
                  />
                </span>
              </motion.h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-[#251c1a] via-[#3a2e2b] to-[#251c1a] my-4 mx-auto relative"
              >
                <motion.div
                  className="absolute inset-0 bg-white/50"
                  animate={{
                    x: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-[#251c1a]/80 text-xl md:text-2xl font-light italic relative"
              >
                Bringing India’s Timeless Traditions to Your Doorstep
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-[#251c1a]/10 via-[#3a2e2b]/10 to-[#251c1a]/10 blur-lg"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.p>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-[#251c1a]/70 text-lg mb-8 max-w-lg mx-auto relative"
            >
              Welcome to Aroha , a celebration of India’s rich heritage and diverse culture. From intricate weaves to exquisite handicrafts, we bring authentic goods from every corner of India to your doorstep. Every product tells a story of tradition and craftsmanship, empowering local artisans and connecting you to India’s cultural legacy.
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-[#251c1a]/5 via-[#3a2e2b]/5 to-[#251c1a]/5 blur-lg"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              ref={searchRef}
              className={`w-full max-w-xl relative mx-auto transition-all duration-300 ${
                searchFocus ? 'shadow-lg' : 'shadow-md'
              }`}
            >
              <div className={`bg-white/90 backdrop-blur-sm rounded-full p-2 pl-6 flex items-center transition-all duration-300 ${
                searchFocus ? 'ring-2 ring-[#251c1a] shadow-xl' : ''
              }`}>
                <input
                  type="text"
                  placeholder="Search for treasures from every corner of India..."
                  className="bg-transparent w-full py-3 outline-none text-[#251c1a] placeholder-[#251c1a]/50"
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`ml-2 rounded-full p-4 flex items-center justify-center transition-all ${
                    searchFocus ? 'bg-[#251c1a] text-white' : 'bg-[#251c1a]/10 text-[#251c1a]'
                  }`}
                  onClick={handleSearch}
                >
                  <FaSearch className={`${searchFocus ? 'scale-110' : ''} transition-transform`} />
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-4 text-[#251c1a]/60 text-sm flex items-center justify-center gap-2"
            >
              Try searching: 
              <motion.span
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                "Clothing"
              </motion.span>
              or
              <motion.span
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                "Handicrafts"
              </motion.span>
            </motion.div>
          </div>
           {/* Right side with responsive image */}
          <div className="lg:col-span-6 flex justify-center">
          <motion.div 
            className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-xl shadow-lg overflow-hidden p-4"
            style={{ backgroundColor: "#f3eee5" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <iframe 
              title="Indian Map 3D Model"
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl"
              style={{ backgroundColor: "#f3eee5" }}
              src="https://sketchfab.com/models/e966a2917ad944ad94530eba5b503527/embed"
            ></iframe>
          </motion.div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
}

export default Hero;