import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon

const categories = [
  'Handicrafts', 'Handloom Textiles', 'Ayurvedic Products', 'Indian Spices & Masalas',
  'Regional Snacks', 'Pottery & Ceramics', 'Ethnic Jewelry', 'Wooden Crafts',
  'Puja Items', 'Local Food Produce', 'Home Decor', 'Artisan Clothing', 'Baked Goods'
];

function CategoriesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Handloom Textiles'); // State to track selected category

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Navigate to the product list page for the selected category
    navigate(`/categories/${encodeURIComponent(category)}`);
  };

  return (
    <section className="min-h-screen py-20 bg-[#f3eee5] relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-[#251c1a] mb-4">Local Finds</h1>
          <p className="text-lg text-[#251c1a]/70">
            Discover unique products from local artisans and producers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto" // Added max-w-4xl and mx-auto
        >
          <h2 className="text-3xl font-bold text-[#251c1a] mb-8 text-center">Explore Categories</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => {
              const isSelected = category === selectedCategory;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(category)} // Updated onClick handler
                  className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${ // Added flex, items-center, justify-center, space-x-2
                    isSelected
                      ? 'bg-[#d97706] text-white' // Style for selected button (orange background)
                      : 'bg-[#fffaf0] text-[#d97706] border border-[#d97706] hover:bg-[#fef3c7]' // Style for non-selected buttons (light background, orange text/border)
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                >
                  <span>{category}</span>
                  {isSelected && <FaArrowRight />} {/* Show arrow only if selected */}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CategoriesPage;
