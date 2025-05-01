import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShoppingCart, FaClock, FaTag, FaStar, FaPaperPlane } from 'react-icons/fa';
// Import toast
import { toast } from 'react-toastify';

// Placeholder function to get product details by ID - replace with actual data fetching
const getProductById = (id) => {
  // Combine all dummy products for searching
  const allProducts = Object.values(dummyProducts).flat();
  // Find the product by ID (convert id from URL string to number if necessary)
  return allProducts.find(p => p.id === parseInt(id));
};

// Placeholder product data (copied from ProductListPage for now)
const dummyProducts = {
  'Handloom Textiles': [
    { id: 1, name: 'Kanjeevaram Silk Saree', brand: 'Kanchi Weaves', price: 8500, image: 'https://images.unsplash.com/photo-1610189334185-6753343d7c8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Authentic Kanjeevaram silk saree with intricate gold zari work.', units: [{ label: '1 Saree', price: 8500, discount: 10, mrp: 9444 }] },
    { id: 2, name: 'Banarasi Brocade Dupatta', brand: 'Varanasi Threads', price: 3200, image: 'https://images.unsplash.com/photo-1598136516531-4d3fd7c4d9c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Luxurious Banarasi brocade dupatta with traditional motifs.', units: [{ label: '1 Dupatta', price: 3200, discount: 15, mrp: 3765 }] },
    { id: 3, name: 'Pashmina Shawl from Kashmir', brand: 'Kashmir Looms', price: 15000, image: 'https://images.unsplash.com/photo-1575439462437-9433759f6f3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Genuine Pashmina shawl, handwoven in Kashmir.', units: [{ label: '1 Shawl', price: 15000, discount: 5, mrp: 15789 }] },
    { id: 4, name: 'Ikat Cotton Kurta Material', brand: 'Orissa Weavers', price: 1800, image: 'https://images.unsplash.com/photo-1604654894610-df63bc5363cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Authentic Ikat weave cotton material from Odisha.', units: [{ label: '2.5 Meters', price: 1800, discount: 8, mrp: 1956 }] },
  ],
  'Handicrafts': [
    { id: 5, name: 'Wooden Elephant Statue (Rajasthan)', brand: 'Jaipur Carvings', price: 999, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Hand-carved wooden elephant statue showcasing Rajasthani artistry.', units: [{ label: '1 Piece', price: 999, discount: 5, mrp: 1050 }] },
    { id: 6, name: 'Bidriware Metal Plate (Karnataka)', brand: 'Bidar Metals', price: 2500, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Traditional Bidriware plate with intricate silver inlay.', units: [{ label: '1 Plate', price: 2500, discount: 10, mrp: 2778 }] },
    { id: 7, name: 'Madhubani Painting on Canvas (Bihar)', brand: 'Mithila Arts', price: 4500, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Vibrant Madhubani painting depicting folk themes.', units: [{ label: '1 Canvas (12x18 in)', price: 4500, discount: 12, mrp: 5114 }] },
    { id: 8, name: 'Blue Pottery Vase (Jaipur)', brand: 'Jaipur Blue Pottery', price: 1200, image: 'https://images.unsplash.com/photo-1549492423-400259a5e5a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Elegant blue pottery vase with traditional floral motifs.', units: [{ label: '1 Vase (8 inch)', price: 1200, discount: 7, mrp: 1290 }] },
  ],
  'Ayurvedic Products': [
    { id: 9, name: 'Neem & Tulsi Face Wash', brand: 'Veda Essentials', price: 250, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Gentle face wash with the goodness of Neem and Tulsi.', units: [{ label: '100 ml', price: 250, discount: 10, mrp: 278 }] },
    { id: 10, name: 'Ashwagandha Herbal Supplement', brand: 'Himalayan Herbs', price: 450, image: 'https://images.unsplash.com/photo-1604187351543-ab4e4e0e9c49?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Pure Ashwagandha root powder for stress relief and vitality.', units: [{ label: '60 Capsules', price: 450, discount: 15, mrp: 529 }] },
  ],
  'Indian Spices & Masalas': [
    { id: 11, name: 'Kerala Cardamom (Elaichi)', brand: 'Malabar Spices', price: 300, image: 'https://images.unsplash.com/photo-1558985250-27a406cd498f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Aromatic green cardamom sourced directly from Kerala.', units: [{ label: '50 g', price: 300, discount: 5, mrp: 316 }] },
    { id: 12, name: 'Kashmiri Saffron (Kesar)', brand: 'Pampore Fields', price: 800, image: 'https://images.unsplash.com/photo-1598680039024-f97c185b8414?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Premium quality Kashmiri saffron threads.', units: [{ label: '1 g', price: 800, discount: 10, mrp: 889 }] },
    { id: 13, name: 'Garam Masala Blend', brand: 'Spice Heritage', price: 150, image: 'https://images.unsplash.com/photo-1512781737819-de14a1eac941?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Traditional blend of aromatic Indian spices.', units: [{ label: '100 g', price: 150, discount: 8, mrp: 163 }] },
  ],
  'Ethnic Jewelry': [
      { id: 14, name: 'Kundan Necklace Set', brand: 'Rajwada Jewels', price: 5500, image: 'https://images.unsplash.com/photo-1588444968576-f8fe92ce56fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Exquisite Kundan necklace set with matching earrings.', units: [{ label: '1 Set', price: 5500, discount: 20, mrp: 6875 }] },
      { id: 15, name: 'Silver Jhumka Earrings', brand: 'Temple Trinkets', price: 1800, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5f4c4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Classic silver jhumka earrings with intricate detailing.', units: [{ label: '1 Pair', price: 1800, discount: 10, mrp: 2000 }] },
  ],
  'Home Decor': [
      { id: 16, name: 'Brass Diya Lamp', brand: 'Divine Decor', price: 750, image: 'https://images.unsplash.com/photo-1601121141499-17ae80afc03a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Traditional brass Diya lamp for auspicious occasions.', units: [{ label: '1 Piece', price: 750, discount: 5, mrp: 789 }] },
      { id: 17, name: 'Toran Door Hanging', brand: 'Gujarat Handicrafts', price: 900, image: 'https://images.unsplash.com/photo-1593079614110-5f1e4f6a7a4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', description: 'Colorful embroidered Toran for decorating doorways.', units: [{ label: '1 Piece', price: 900, discount: 10, mrp: 1000 }] },
  ],
  'Hershey\'s Cookies n Creme': [ // Example based on image - Replaced with fictional brand
    { id: 100, name: 'Cookies n Creme Chocolate Bar', brand: 'Malabar Cocoa', price: 128, image: 'https://via.placeholder.com/600x400.png?text=Choco+Bar', description: 'Creamy white chocolate with crunchy cookie pieces.', deliveryTime: 'Delivery in 3 days', units: [ // Changed delivery time here
        { label: '100 g', price: 128, discount: 14, mrp: 150 },
        { label: '2 x 100 g', price: 252, discount: 16, mrp: 300 }
      ]
    }
  ]
};

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = getProductById(productId);
  const [selectedUnit, setSelectedUnit] = useState(product?.units[0] || null);
  const [reviewText, setReviewText] = useState('');
  const [isAdding, setIsAdding] = useState(false); // State to disable button during API call

  const handleAddToCart = async () => {
    if (!product || !selectedUnit || isAdding) {
      return; // Don't proceed if product/unit not selected or already adding
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please sign in to add items to your cart.");
      navigate('/signin'); // Redirect to sign-in page
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/add/', { // Use your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          product_id: productId, // Send the product ID from useParams
          quantity: 1, // Defaulting to 1 for now, adjust if quantity selection is added
          // Add the missing fields required by the backend
          product_name: product.name,
          unit_label: selectedUnit.label,
          price: selectedUnit.price,
        }),
      });

      if (response.ok) {
        const cartData = await response.json();
        console.log('Cart updated:', cartData);
        toast.success(`${product.name} (${selectedUnit.label}) added to cart!`); // Include unit label in toast
        // Optionally update local cart state or trigger a refresh
      } else {
        const errorData = await response.json();
        console.error('Failed to add to cart:', errorData);
        toast.error(errorData.error || 'Failed to add item to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred. Please check your connection and try again.');
    } finally {
      setIsAdding(false); // Re-enable button
    }
  };

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = () => {
    if (reviewText.trim()) {
      console.log(`Submitting review for product ${productId}: ${reviewText}`);
      // TODO: Implement actual review submission logic (call API)
      setReviewText(''); // Clear textarea after submission
    } else {
      console.log('Review cannot be empty.');
      // Optionally show an error message to the user
    }
  };

  if (!product) {
    return (
      <section className="min-h-screen py-20 bg-[#f3eee5] pt-24 flex items-center justify-center">
        <p className="text-xl text-[#251c1a]/70">Product not found.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 bg-[#f3eee5] pt-24">
      <div className="container mx-auto px-6 sm:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate(-1)} // Go back to the previous page
          className="flex items-center space-x-2 text-[#251c1a] hover:text-[#d97706] transition-colors mb-6"
        >
          <FaArrowLeft />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12"> {/* Added mb-12 */}
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-contain p-4" // Use contain to show full image
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Brand Name */}
            {product.brand && (
              <div className="flex items-center text-sm text-[#d97706] mb-2 font-semibold">
                <FaTag className="mr-1.5" />
                <span>{product.brand}</span>
              </div>
            )}
            <h1 className="text-4xl font-bold text-[#251c1a] mb-3">{product.name}</h1>
            {product.deliveryTime && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FaClock className="mr-1" /> {product.deliveryTime}
              </div>
            )}
            <p className="text-[#251c1a]/70 mb-6 text-lg">{product.description}</p>

            {/* Unit Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#251c1a] mb-3">Select Unit</h3>
              <div className="flex flex-wrap gap-3">
                {product.units.map((unit, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedUnit(unit)}
                    className={`border rounded-lg p-3 text-left transition-all duration-200 ${selectedUnit === unit ? 'border-[#d97706] bg-[#fffaf0] ring-2 ring-[#d97706]' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                  >
                    {unit.discount && (
                      <span className="block text-xs font-semibold text-green-600 mb-1">{unit.discount}% OFF</span>
                    )}
                    <span className="block font-medium text-[#251c1a]">{unit.label}</span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-xl font-bold text-[#d97706]">₹{unit.price}</span>
                      {unit.mrp && unit.mrp > unit.price && (
                        <span className="text-sm text-gray-500 line-through">MRP ₹{unit.mrp}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: !isAdding ? 1.05 : 1 }} // Disable hover effect when adding
                whileTap={{ scale: !isAdding ? 0.95 : 1 }} // Disable tap effect when adding
                onClick={handleAddToCart}
                disabled={isAdding} // Disable button when adding
                className={`bg-gradient-to-r from-[#251c1a] to-[#3a2e2b] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaShoppingCart className="text-xl" />
                <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
              </motion.button>
              {selectedUnit && (
                 <span className="text-2xl font-bold text-[#251c1a]">₹{selectedUnit.price}</span>
              )}
            </div>
             <p className="text-xs text-gray-500 mt-2">(Inclusive of all taxes)</p>

          </motion.div>
        </div>

        {/* Review Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6 mt-8" // Added mt-8 for spacing
        >
          <h2 className="text-2xl font-bold text-[#251c1a] mb-4">Leave a Review</h2>
          {/* TODO: Add star rating input here if desired */}
          <textarea
            value={reviewText}
            onChange={handleReviewChange}
            rows="4"
            placeholder="Share your thoughts about this product..."
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[#251c1a]/10 focus:outline-none focus:ring-2 focus:ring-[#251c1a]/20 mb-4"
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitReview}
            className="bg-[#d97706] text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <FaPaperPlane />
            <span>Submit Review</span>
          </motion.button>
        </motion.div>

        {/* TODO: Add section to display existing reviews */}

      </div>
    </section>
  );
}

export default ProductDetailPage;