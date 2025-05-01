import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';

// Placeholder product data - replace with actual data fetching later
const dummyProducts = {
  'Handloom Textiles': [
    { id: 1, name: 'Kanjeevaram Silk Saree', price: 8500, image: 'https://images.unsplash.com/photo-1610189334185-6753343d7c8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 2, name: 'Banarasi Brocade Dupatta', price: 3200, image: 'https://images.unsplash.com/photo-1598136516531-4d3fd7c4d9c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 3, name: 'Pashmina Shawl from Kashmir', price: 15000, image: 'https://images.unsplash.com/photo-1575439462437-9433759f6f3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 4, name: 'Ikat Cotton Kurta Material', price: 1800, image: 'https://images.unsplash.com/photo-1604654894610-df63bc5363cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
  'Handicrafts': [
    { id: 5, name: 'Wooden Elephant Statue (Rajasthan)', price: 999, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 6, name: 'Bidriware Metal Plate (Karnataka)', price: 2500, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' }, // Placeholder image
    { id: 7, name: 'Madhubani Painting on Canvas (Bihar)', price: 4500, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 8, name: 'Blue Pottery Vase (Jaipur)', price: 1200, image: 'https://images.unsplash.com/photo-1549492423-400259a5e5a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
  'Ayurvedic Products': [
    { id: 9, name: 'Neem & Tulsi Face Wash', price: 250, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 10, name: 'Ashwagandha Herbal Supplement', price: 450, image: 'https://images.unsplash.com/photo-1604187351543-ab4e4e0e9c49?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
  'Indian Spices & Masalas': [
    { id: 11, name: 'Kerala Cardamom (Elaichi)', price: 300, image: 'https://images.unsplash.com/photo-1558985250-27a406cd498f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 12, name: 'Kashmiri Saffron (Kesar)', price: 800, image: 'https://images.unsplash.com/photo-1598680039024-f97c185b8414?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 13, name: 'Garam Masala Blend', price: 150, image: 'https://images.unsplash.com/photo-1512781737819-de14a1eac941?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
  'Ethnic Jewelry': [
      { id: 14, name: 'Kundan Necklace Set', price: 5500, image: 'https://images.unsplash.com/photo-1588444968576-f8fe92ce56fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
      { id: 15, name: 'Silver Jhumka Earrings', price: 1800, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5f4c4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
  'Home Decor': [
      { id: 16, name: 'Brass Diya Lamp', price: 750, image: 'https://images.unsplash.com/photo-1601121141499-17ae80afc03a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
      { id: 17, name: 'Toran Door Hanging', price: 900, image: 'https://images.unsplash.com/photo-1593079614110-5f1e4f6a7a4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' }, // Placeholder image
  ]
  // Add more categories and products as needed
};

function ProductListPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const products = dummyProducts[categoryName] || []; // Get products for the category

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`); // Navigate to the product detail page
  };

  return (
    <section className="min-h-screen py-20 bg-[#f3eee5] relative overflow-hidden pt-24"> {/* Added pt-24 */}
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        {/* Header with Back Button and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-10"
        >
          <button
            onClick={() => navigate('/categories')} // Navigate back to the categories page
            className="p-3 rounded-full hover:bg-[#e2dac9] transition-colors mr-4"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-[#251c1a] text-xl" />
          </button>
          <h1 className="text-4xl font-bold text-[#251c1a]">{categoryName}</h1>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col" // Added flex flex-col
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover" // Fixed height for images
                />
                <div className="p-4 flex flex-col flex-grow"> {/* Added flex-grow */}
                  <h3 className="text-lg font-semibold text-[#251c1a] mb-2 flex-grow">{product.name}</h3> {/* Added flex-grow */}
                  <p className="text-xl font-bold text-[#d97706] mb-4">₹{product.price}</p>
                  <button
                    className="mt-auto w-full border border-[#d97706] text-[#d97706] py-2 px-4 rounded-md hover:bg-[#fffaf0] transition-colors flex items-center justify-center space-x-2" // Added mt-auto
                    onClick={() => handleViewProduct(product.id)} // Updated onClick handler
                  >
                    <span>View Product</span>
                    <FaExternalLinkAlt size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-[#251c1a]/70">No products found in this category yet.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default ProductListPage;
