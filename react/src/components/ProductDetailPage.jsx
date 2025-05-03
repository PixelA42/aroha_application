import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaPlus, FaMinus, FaChevronDown, FaChevronUp, FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa'; // Added icons
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// Import the updated getProductById function from ProductListPage
import { getProductById } from './ProductListPage'; // Adjust path if necessary

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

  // Fetch Product Details - Uses imported getProductById now
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // --- Use the IMPORTED getProductById function ---
        const fetchedProduct = getProductById(productId);
        // --- End of Updated Logic ---

        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // Default to the first unit if available
          // Ensure units exist and is an array before accessing
          if (fetchedProduct.units && Array.isArray(fetchedProduct.units) && fetchedProduct.units.length > 0) {
            setSelectedUnit(fetchedProduct.units[0]);
          } else if (!fetchedProduct.units) {
            // Handle cases where product might not have units defined (use base price/mrp if available)
            // This sets a default selectedUnit structure for products without explicit units
             setSelectedUnit({
                label: 'Standard', // Or some default label
                price: fetchedProduct.price,
                mrp: fetchedProduct.mrp || fetchedProduct.price // Use price if mrp is missing
             });
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
    // Ensure product and selectedUnit are loaded, and not already adding
    if (!product || !selectedUnit || isAdding) {
      toast.warn("Please select a unit before adding to cart."); // More specific warning
      return;
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
      // The product_id sent to backend should uniquely identify the product *variant* (product + unit)
      const productIdString = `${product.id}_${selectedUnit.label}`; // Example: "2_Standard"

      const response = await fetch('http://127.0.0.1:8000/api/cart/add/', { // Use your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          product_id: productIdString, // Send the combined identifier
          quantity: 1, // Defaulting to 1 for now, adjust if quantity selection is added
          // Send price and mrp from the *selected unit*
          price: selectedUnit.price,
          mrp: selectedUnit.mrp // Send MRP from selected unit
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
              {/* UPDATED: Display Category and Brand, Removed Origin */}
              <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
                {product.category && <span>Category: {product.category}</span>}
                {product.category && product.brand && <span>|</span>}
                {product.brand && <span>Brand: {product.brand}</span>}
                {/* Removed Origin Span */}
              </div>

              {/* Average Rating Display */}
              {reviews.length > 0 && (
                <div className="flex items-center mb-4">
                  {renderStars(averageRating)}
                  <span className="ml-2 text-gray-600 text-sm">({averageRating.toFixed(1)} average rating from {reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              )}

              {/* Unit Selection - Ensure product.units is checked */}
              {Array.isArray(product.units) && product.units.length > 0 && (
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
                        {/* Optionally show MRP/Discount */}
                        {unit.mrp && unit.mrp > unit.price && (
                            <span className="ml-2 text-xs line-through text-gray-400">₹{unit.mrp}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Display - Updated logic to handle selectedUnit */}
              <p className="text-2xl font-semibold text-[#b19f84] mb-1">
                ₹{selectedUnit ? selectedUnit.price : product.price}
                {/* Show MRP if available and different */}
                {selectedUnit && selectedUnit.mrp && selectedUnit.mrp > selectedUnit.price && (
                    <span className="ml-2 text-base line-through text-gray-400 font-normal">₹{selectedUnit.mrp}</span>
                )}
                 {/* Show Discount Percentage */}
                 {selectedUnit && selectedUnit.mrp && selectedUnit.mrp > selectedUnit.price && (
                    <span className="ml-3 text-sm font-medium text-green-600">
                        ({Math.round(((selectedUnit.mrp - selectedUnit.price) / selectedUnit.mrp) * 100)}% off)
                    </span>
                 )}
              </p>
              <p className="text-xs text-gray-500 mb-4">incl. of all taxes</p>

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#251c1a] mb-1">Description</h3>
                {/* Add check for product.description */}
                {product.description ? (
                  <>
                    <p className={`text-gray-600 text-sm leading-relaxed ${showFullDescription ? '' : 'line-clamp-3'}`}>
                      {product.description}
                    </p>
                    {/* Only show toggle if description exists and is long */}
                    {product.description.length > 150 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-sm text-[#b19f84] hover:underline mt-1 flex items-center"
                      >
                        {showFullDescription ? 'Show Less' : 'Show More'}
                        {showFullDescription ? <FaChevronUp className="ml-1" size={12}/> : <FaChevronDown className="ml-1" size={12}/>}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm italic">No description available.</p> // Placeholder for missing description
                )}
              </div>

              {/* Stock Info - Added check for undefined stock */}
              {typeof product.stock !== 'undefined' && (
                  <p className={`text-sm mb-5 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
              )}
            </div>

            {/* Add to Cart Button - Ensure selectedUnit is required */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding || (typeof product.stock !== 'undefined' && product.stock === 0) || !selectedUnit} // Disable if no unit selected
              className="w-full bg-gradient-to-r from-[#251c1a] to-[#3a2e2b] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart />
              <span>{isAdding ? 'Adding...' : ((typeof product.stock !== 'undefined' && product.stock === 0) ? 'Out of Stock' : (!selectedUnit ? 'Select Unit' : 'Add to Cart'))}</span>
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