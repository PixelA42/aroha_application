import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaTrash, FaPlus, FaMinus, FaInfoCircle, FaRupeeSign, FaShoppingBag, FaFileInvoiceDollar, FaTimesCircle } from 'react-icons/fa'; // Added FaTimesCircle
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchCartApi, updateCartItemQuantity, removeCartItemApi, clearCartApi } from '../api'; // Import clearCartApi and others

// Placeholder function for product images (replace with actual logic if needed)
const getProductImage = (productIdentifier) => {
    // Example: Check if it's the placeholder chocolate bar
    if (productIdentifier && productIdentifier.startsWith('100')) {
        return 'https://via.placeholder.com/60x60.png?text=Choco+Bar';
    }
    // Default placeholder
    return 'https://via.placeholder.com/60x60.png?text=Product';
};

function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingItemId, setUpdatingItemId] = useState(null); // Track which item is being updated
    const [isClearing, setIsClearing] = useState(false); // State for clearing notification
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Fetch Cart Data
    const fetchCart = async () => {
        if (!token) {
            toast.error("Please log in to view your cart.");
            navigate('/signin');
            return;
        }
        setLoading(true);
        try {
            const cartData = await fetchCartApi();
            setCart(cartData);
            setError(null); // Clear previous errors on success
        } catch (e) {
            console.error("Failed to fetch cart:", e);
            setError(e.message || "Failed to load cart.");
            toast.error(<> <FaTimesCircle className="inline mr-1" /> {e.message || "Failed to load cart."} </>);
            setCart(null); // Clear cart data on error
        } finally {
            setLoading(false);
        }
    };

    // Update Item Quantity
    const handleUpdateQuantity = async (itemProductId, newQuantity) => {
        if (!token || updatingItemId) return;
        setUpdatingItemId(itemProductId); // Indicate start of update for this item
        try {
            const data = await updateCartItemQuantity(itemProductId, newQuantity);
            setCart(data.cart); // Update cart state with the response
            toast.success("Cart updated.");
            setError(null);
        } catch (e) {
            console.error("Failed to update quantity:", e);
            setError(e.message || "Failed to update item quantity.");
            toast.error(<> <FaTimesCircle className="inline mr-1" /> {e.message || "Failed to update quantity."} </>);
        } finally {
            setUpdatingItemId(null); // Indicate end of update
        }
    };

    // Remove Item
    const handleRemoveItem = async (itemProductId) => {
        if (!token || updatingItemId) return;
        setUpdatingItemId(itemProductId); // Use same state to disable buttons during removal
        try {
            const data = await removeCartItemApi(itemProductId);
            setCart(data.cart); // Update cart state
            toast.success("Item removed from cart.");
            setError(null);
        } catch (e) {
            console.error("Failed to remove item:", e);
            setError(e.message || "Failed to remove item.");
            toast.error(<> <FaTimesCircle className="inline mr-1" /> {e.message || "Failed to remove item."} </>);
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Clear Entire Cart
    const handleClearCart = async () => {
        if (!token || isClearing || loading) return;

        // Confirmation dialog
        if (!window.confirm("Are you sure you want to remove all items from your cart?")) {
            return;
        }

        setIsClearing(true);
        toast.info("Clearing your cart...", { toastId: 'clearingCart' });
        try {
            const data = await clearCartApi(); // Call the API function
            setCart(data.cart); // Update cart state with the empty cart from response
            toast.dismiss('clearingCart');
            toast.success("Cart cleared successfully!");
            setError(null);
        } catch (e) {
            console.error("Failed to clear cart:", e);
            toast.dismiss('clearingCart');
            const errorMessage = e.message || "Failed to clear cart.";
            setError(errorMessage);
            toast.error(`Error: ${errorMessage}`); // Simplified error toast
        } finally {
            setIsClearing(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token, navigate]); // Rerun if token changes (e.g., login/logout)

    const handleProceedToCheckout = () => {
        if (cart && cart.items.length > 0) {
            navigate('/checkout');
        } else {
            toast.info("Your cart is empty. Add items before proceeding.");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f3eee5] pt-20">Loading cart...</div>; 
    }

    // Display error message if cart failed to load
    if (error && !cart) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3eee5] pt-20 text-red-600">
                <p>Error: {error}</p>
                <button onClick={fetchCart} className="mt-4 px-4 py-2 bg-[#251c1a] text-white rounded hover:bg-[#3a2e2b]">
                    Retry
                </button>
            </div>
        );
    }

    // Handle case where cart is loaded but empty
    if (!cart || cart.items.length === 0) {
        return (
            <section className="min-h-screen py-20 bg-[#f3eee5] pt-24"> 
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-lg shadow-md"
                    >
                        <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-[#251c1a] mb-2">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <Link
                            to="/categories" // Link to product categories or home page
                            className="inline-block bg-gradient-to-r from-[#251c1a] to-[#3a2e2b] text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Start Shopping
                        </Link>
                    </motion.div>
                </div>
            </section>
        );
    }

    // Main cart view
    return (
        <section className="min-h-screen py-20 bg-[#f3eee5] pt-24"> 
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-[#251c1a] mb-6 flex justify-between items-center" // Added flex for alignment
                >
                    <span>My Cart ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})</span>
                    {/* Clear Cart Button */}
                    <button
                        onClick={handleClearCart}
                        disabled={loading || isClearing || updatingItemId !== null}
                        className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaTimesCircle className="mr-1" /> Clear All
                    </button>
                </motion.h1>

                {/* Display general error messages if any occurred during updates/removals */}
                {error && <p className="text-red-500 text-sm mb-4">Error: {error}</p>}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Cart Items List */}
                    <div className="divide-y divide-gray-200">
                        {cart.items.map(item => (
                            <motion.div
                                key={item.product} // Use the unique product identifier as key
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0"
                            >
                                <div className="flex items-center space-x-4 flex-grow">
                                    {/* Use item.image_url if available, otherwise fallback */}
                                    <img 
                                        src={item.image_url || getProductImage(item.product)} 
                                        alt={item.product_name || 'Product'} 
                                        className="w-16 h-16 object-contain border rounded flex-shrink-0" 
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.product_name || 'Product Name Missing'}</p>
                                        <p className="text-sm text-gray-500">{item.unit_label || 'Unit'}</p>
                                        <p className="text-sm font-medium text-[#b19f84]">₹{item.price}</p>
                                        {item.mrp && item.mrp > item.price && (
                                            <p className="text-xs text-gray-400 line-through">MRP: ₹{item.mrp}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border rounded">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product, item.quantity - 1)}
                                            disabled={updatingItemId === item.product || item.quantity <= 1}
                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaMinus size={12} />
                                        </button>
                                        <span className="px-3 py-1 text-sm font-medium">
                                            {updatingItemId === item.product ? '...' : item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                                            disabled={updatingItemId === item.product}
                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaPlus size={12} />
                                        </button>
                                    </div>
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item.product)}
                                        disabled={updatingItemId === item.product}
                                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remove item"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="bg-gray-50 p-4 border-t">
                        <div className="max-w-sm ml-auto space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Items Total:</span>
                                <span className="font-medium">₹{cart.total_price}</span>
                            </div>
                            {cart.total_savings > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>You Save:</span>
                                    <span className="font-medium">- ₹{cart.total_savings}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Charges:</span>
                                <span className="font-medium">₹{cart.delivery_charge}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Handling Charges:</span>
                                <span className="font-medium">₹{cart.handling_charge}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-[#251c1a] pt-2 border-t mt-2">
                                <span>Grand Total:</span>
                                <span>₹{cart.grand_total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                    <Link
                        to="/categories" // Link back to shopping
                        className="text-[#251c1a] hover:underline text-sm"
                    >
                        &larr; Continue Shopping
                    </Link>
                    <button
                        onClick={handleProceedToCheckout}
                        disabled={loading || updatingItemId !== null || isClearing}
                        className="bg-gradient-to-r from-[#251c1a] to-[#3a2e2b] text-white py-3 px-8 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaFileInvoiceDollar />
                        <span>Proceed to Checkout</span>
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CartPage;