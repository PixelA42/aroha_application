import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaPlus, FaMinus, FaChevronDown, FaChevronUp, FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa'; // Added icons
import { motion, AnimatePresence } from 'framer-motion';
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
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // State for add to cart button
  const [showFullDescription, setShowFullDescription] = useState(false);

  // --- Review State ---
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0); // 0 means no rating selected
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  // --- End Review State ---

  const user = JSON.parse(localStorage.getItem('user')); // Get user info
  const token = localStorage.getItem('token'); // Get auth token

  // Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // --- Use the existing getProductById function --- 
        const fetchedProduct = getProductById(productId);
        // --- End of Reverted Logic --- 

        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // Default to the first unit if available
          if (fetchedProduct.units && fetchedProduct.units.length > 0) {
            setSelectedUnit(fetchedProduct.units[0]);
          }
        } else {
          setError('Product not found.');
        }
      } catch (e) {
        console.error("Failed to fetch product:", e);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // --- Fetch Reviews ---
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      setLoadingReviews(true);
      setReviewError(null);
      try {
        // Use the actual product ID from the state if available, or from params
        const identifier = product ? product.id : productId;
        const response = await fetch(`http://127.0.0.1:8000/api/reviews/product/${identifier}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data);
      } catch (e) {
        console.error("Failed to fetch reviews:", e);
        setReviewError('Could not load reviews.');
      } finally {
        setLoadingReviews(false);
      }
    };
    // Fetch reviews only after product is loaded to ensure we have the correct ID
    if (product) {
        fetchReviews();
    }
  }, [product, productId]); // Depend on product state
  // --- End Fetch Reviews ---

  // --- Handle Add to Cart ---
  const handleAddToCart = async () => {
    // ... (existing handleAddToCart logic remains the same) ...
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
      // Use product.id which should be correctly set now
      const productIdString = `${product.id}_${selectedUnit.label}`;
      const response = await fetch('http://127.0.0.1:8000/api/cart/add/', { // Use your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          product_id: productIdString, // Combine product ID and unit label
          quantity: 1, // Defaulting to 1 for now, adjust if quantity selection is added
          product_name: product.name,
          unit_label: selectedUnit.label,
          price: selectedUnit.price,
          mrp: selectedUnit.mrp // <-- Add this line to send MRP
        }),
      });

      if (response.ok) {
        const cartData = await response.json();
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
  // --- End Handle Add to Cart ---

  // --- Review Form Handlers ---
  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleNameChange = (e) => {
    setReviewerName(e.target.value);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating (1-5 stars).");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write your review.");
      return;
    }
    if (!user && !reviewerName.trim()) {
        toast.error("Please enter your name.");
        return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);

    const reviewData = {
        product_identifier: product.id.toString(), // Use the actual product ID
        rating: rating,
        text: reviewText,
        // Only include reviewer_name if the user is not logged in
        ...( !user && { reviewer_name: reviewerName.trim() } )
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/reviews/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include Authorization header only if user is logged in
                ...(token && { 'Authorization': `Token ${token}` })
            },
            body: JSON.stringify(reviewData),
        });

        if (response.ok) {
            const newReview = await response.json();
            // Add the new review to the top of the list
            setReviews([newReview, ...reviews]);
            toast.success("Review submitted successfully!");
            // Reset form and hide it
            setRating(0);
            setReviewText('');
            setReviewerName(''); // Clear name field too
            setShowReviewForm(false);
        } else {
            const errorData = await response.json();
            console.error('Failed to submit review:', errorData);
            // Construct a user-friendly error message
            let errorMessage = "Failed to submit review.";
            if (errorData.rating) errorMessage += ` Rating: ${errorData.rating.join(' ')}`;
            if (errorData.text) errorMessage += ` Review: ${errorData.text.join(' ')}`;
            if (errorData.reviewer_name) errorMessage += ` Name: ${errorData.reviewer_name.join(' ')}`;
            if (errorData.detail) errorMessage = errorData.detail; // General error from backend
            toast.error(errorMessage);
            setReviewError(errorMessage); // Keep error state for potential display
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        toast.error('An network error occurred. Please try again.');
        setReviewError('An network error occurred.');
    } finally {
        setIsSubmittingReview(false);
    }
  };
  // --- End Review Form Handlers ---


  // --- Helper Functions ---
  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} className={i <= ratingValue ? 'text-yellow-500' : 'text-gray-300'} />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // --- End Helper Functions ---


  if (loading) {
    return (
      <section className="min-h-screen py-20 bg-[#f3eee5] pt-24 flex items-center justify-center">
        <p className="text-xl text-[#251c1a]/70">Loading product...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen py-20 bg-[#f3eee5] pt-24 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </section>
    );
  }

  if (!product) {
    // This case might be redundant if error handles 'Product not found'
    return (
      <section className="min-h-screen py-20 bg-[#f3eee5] pt-24 flex items-center justify-center">
        <p className="text-xl text-[#251c1a]/70">Product not found.</p>
      </section>
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
    : 0;

  return (
    <section className="min-h-screen py-10 bg-[#f3eee5] pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-lg shadow-md flex justify-center items-center"
          >
            <img src={product.image} alt={product.name} className="max-h-[400px] object-contain" />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-[#251c1a] mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
                <span>Category: {product.category}</span>
                <span>|</span>
                <span>Brand: {product.brand}</span>
                <span>|</span>
                <span>Origin: {product.origin}</span>
              </div>

              {/* Average Rating Display */}
              {reviews.length > 0 && (
                <div className="flex items-center mb-4">
                  {renderStars(averageRating)}
                  <span className="ml-2 text-gray-600 text-sm">({averageRating.toFixed(1)} average rating from {reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              )}

              {/* Unit Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Unit:</label>
                <div className="flex flex-wrap gap-2">
                  {product.units.map((unit) => (
                    <button
                      key={unit.label}
                      onClick={() => setSelectedUnit(unit)}
                      className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                        selectedUnit?.label === unit.label
                          ? 'bg-[#251c1a] text-white border-[#251c1a]'
                          : 'bg-white text-[#251c1a] border-gray-300 hover:border-[#251c1a]'
                      }`}
                    >
                      {unit.label} - ₹{unit.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              {selectedUnit && (
                <p className="text-2xl font-semibold text-[#b19f84] mb-4">
                  ₹{selectedUnit.price}
                </p>
              )}

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#251c1a] mb-1">Description</h3>
                <p className={`text-gray-600 text-sm leading-relaxed ${showFullDescription ? '' : 'line-clamp-3'}`}>
                  {product.description}
                </p>
                {product.description.length > 150 && ( // Only show toggle if description is long
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-sm text-[#b19f84] hover:underline mt-1 flex items-center"
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                    {showFullDescription ? <FaChevronUp className="ml-1" size={12}/> : <FaChevronDown className="ml-1" size={12}/>}
                  </button>
                )}
              </div>

              {/* Stock Info - Added check for undefined stock */}
              {typeof product.stock !== 'undefined' && (
                  <p className={`text-sm mb-5 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
              )}
            </div>

            {/* Add to Cart Button - Added check for undefined stock */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding || (typeof product.stock !== 'undefined' && product.stock === 0) || !selectedUnit}
              className="w-full bg-gradient-to-r from-[#251c1a] to-[#3a2e2b] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart />
              <span>{isAdding ? 'Adding...' : ((typeof product.stock !== 'undefined' && product.stock === 0) ? 'Out of Stock' : 'Add to Cart')}</span>
            </button>
          </motion.div>
        </div>

        {/* --- Customer Reviews Section --- */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#251c1a] flex items-center">
              <FaCommentDots className="mr-2"/> Customer Reviews ({reviews.length})
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-[#251c1a] hover:bg-gray-50 transition-colors"
            >
              {showReviewForm ? <FaTimes className="mr-2"/> : <FaPlus className="mr-2"/>}
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* --- Review Form (Animated) --- */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-6 border rounded-lg p-4 bg-gray-50"
              >
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#251c1a]">Write Your Review</h3>
                  {/* Name Input (only if not logged in) */}
                  {!user && (
                     <div>
                        <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            id="reviewerName"
                            value={reviewerName}
                            onChange={handleNameChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#b19f84]"
                            required
                            placeholder="Enter your name"
                        />
                     </div>
                  )}
                  {/* Rating Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating <span className="text-red-500">*</span></label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRating(star)}
                          className="focus:outline-none"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          {star <= rating ? (
                            <FaStar className="text-yellow-500 text-2xl" />
                          ) : (
                            <FaRegStar className="text-gray-400 text-2xl hover:text-yellow-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Review Text Input */}
                  <div>
                    <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">Your Review <span className="text-red-500">*</span></label>
                    <textarea
                      id="reviewText"
                      rows="4"
                      value={reviewText}
                      onChange={handleReviewChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#b19f84]"
                      required
                      placeholder="Share your thoughts about the product..."
                    ></textarea>
                  </div>
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="flex items-center justify-center px-5 py-2 bg-[#251c1a] text-white rounded-md font-medium hover:bg-[#3a2e2b] transition-colors disabled:opacity-50"
                    >
                      <FaPaperPlane className="mr-2" />
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                   {reviewError && <p className="text-sm text-red-600 mt-2">{reviewError}</p>}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          {/* --- End Review Form --- */} {/* Corrected comment syntax */}


          {/* --- Display Reviews --- */}
          {loadingReviews && <p className="text-gray-500">Loading reviews...</p>}
          {!loadingReviews && reviewError && <p className="text-red-500">{reviewError}</p>}
          {!loadingReviews && !reviewError && reviews.length === 0 && (
            <p className="text-gray-500">Be the first to review this product!</p>
          )}
          {!loadingReviews && !reviewError && reviews.length > 0 && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center mb-2">
                     {/* Simple Initial Circle */}
                     <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-sm font-semibold text-gray-600">
                        {review.reviewer_name ? review.reviewer_name.charAt(0).toUpperCase() : '?'}
                     </div>
                     <div>
                        <p className="font-semibold text-[#251c1a]">{review.reviewer_name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                     </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </div>
          )}
          {/* --- End Display Reviews --- */}
        </div>
        {/* --- End Customer Reviews Section --- */}

      </div>
    </section>
  );
}

export default ProductDetailPage;