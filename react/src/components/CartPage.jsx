import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaTrash, FaPlus, FaMinus, FaInfoCircle, FaRupeeSign, FaShoppingBag, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Placeholder for fetching product image - replace with actual logic if needed
const getProductImage = (productIdentifier) => {
    // Example: Extract ID if your identifier is like "100_100 g"
    // const productId = productIdentifier.split('_')[0];
    // Based on productId, return the correct image URL
    // For now, using a placeholder
    if (productIdentifier && productIdentifier.startsWith('100')) { // Example check for Hershey's
         return 'https://via.placeholder.com/100x100.png?text=Choco+Bar'; // Replace with actual image
    }
    return 'https://via.placeholder.com/100x100.png?text=Product'; // Default placeholder
}

function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')); // Check if user is logged in
    const token = localStorage.getItem('token'); // Get auth token

    const fetchCart = async () => {
        if (!token) {
            setError("Please log in to view your cart.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/cart/', { // Use full URL
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                     // Clear invalid token and user data, then redirect
                     localStorage.removeItem('token');
                     localStorage.removeItem('user');
                     navigate('/signin');
                     throw new Error("Authentication failed. Please log in again.");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCart(data);
        } catch (e) {
            console.error("Failed to fetch cart:", e);
            // Avoid setting error if it's just an auth failure redirect
            if (e.message !== "Authentication failed. Please log in again.") {
                setError(e.message || "Failed to load cart data.");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemProductId, newQuantity) => {
        if (!token) return;
        setLoading(true); // Indicate loading during update
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/cart/update/${itemProductId}/`, { // Use full URL
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }
            const data = await response.json();
            // Update cart state directly from the response which contains the updated cart
            setCart(data.cart);
            setError(null); // Clear previous errors
        } catch (e) {
            console.error("Failed to update quantity:", e);
            setError("Failed to update item quantity.");
            // Optionally refetch cart to ensure consistency on error
            // fetchCart(); 
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemProductId) => {
        if (!token) return;
        setLoading(true); // Indicate loading during removal
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/cart/remove/${itemProductId}/`, { // Use full URL
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to remove item');
            }
            const data = await response.json();
            // Update cart state directly from the response which contains the updated cart
            setCart(data.cart);
             setError(null); // Clear previous errors
        } catch (e) {
            console.error("Failed to remove item:", e);
            setError("Failed to remove item from cart.");
             // Optionally refetch cart to ensure consistency on error
            // fetchCart();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]); // Refetch if token changes (e.g., user logs in/out)

    if (loading && !cart) { // Show initial loading state
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">Loading cart...</div>;
    }

    if (error && !user) { // Specific error for non-logged-in users
         return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20 text-red-600">
                <p>{error}</p>
                <Link to="/signin" className="mt-4 px-4 py-2 bg-[#251c1a] text-white rounded hover:bg-[#3a2e2b]">
                    Login to View Cart
                </Link>
            </div>
        );
    }
    
    if (error) { // General error display for logged-in users
         return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20 text-red-600">
                <p>Error: {error}</p>
                <button onClick={fetchCart} className="mt-4 px-4 py-2 bg-[#251c1a] text-white rounded hover:bg-[#3a2e2b]">
                    Retry
                </button>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20">
                <FaShoppingBag className="text-6xl text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
                <Link to="/categories" className="px-6 py-3 bg-[#251c1a] text-white rounded-lg hover:bg-[#3a2e2b] transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    // Calculate savings (assuming original price needs to be derived or stored)
    // This is a placeholder - you might need to adjust based on how you store MRP/discounts
    const calculateTotalSavings = () => {
        // Example: If you had an 'mrp' field on CartItem model/serializer
        // return cart.items.reduce((total, item) => {
        //     const mrp = parseFloat(item.mrp || item.price); // Assume mrp if available
        //     const price = parseFloat(item.price);
        //     return total + (mrp - price) * item.quantity;
        // }, 0).toFixed(2);
        return "22.00"; // Placeholder based on image
    };
    const totalSavings = calculateTotalSavings();
    const itemsTotalMRP = (parseFloat(cart.total_price) + parseFloat(totalSavings)).toFixed(2); // Placeholder calculation

    return (
        <section className="min-h-screen py-20 bg-gray-100 pt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-[#251c1a] mb-6"
                >
                    My Cart ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items & Delivery Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Savings Banner */}
                        {parseFloat(totalSavings) > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-blue-100 text-blue-800 p-3 rounded-lg text-sm font-medium flex justify-between items-center"
                            >
                                <span>Your total savings</span>
                                <span>₹{totalSavings}</span>
                            </motion.div>
                        )}

                        {/* Delivery Section (Example) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <div className="flex items-center mb-3">
                                <FaClock className="text-green-600 text-xl mr-3" />
                                <div>
                                    <p className="font-semibold text-[#251c1a]">Delivery in 8 minutes</p> {/* Example time */}
                                    <p className="text-sm text-gray-500">Shipment of {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            {/* Cart Items List */}
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item.product} className="flex items-start sm:items-center justify-between border-t pt-4 flex-wrap sm:flex-nowrap">
                                        <div className="flex items-center space-x-3 mb-3 sm:mb-0 flex-grow">
                                            <img src={getProductImage(item.product)} alt={item.product_name} className="w-16 h-16 object-contain border rounded flex-shrink-0" />
                                            <div className="flex-grow">
                                                <p className="font-medium text-sm text-[#251c1a]">{item.product_name}</p>
                                                <p className="text-xs text-gray-500">{item.unit_label}</p>
                                                <p className="text-sm font-semibold text-[#251c1a] mt-1">
                                                    ₹{item.price}
                                                    {/* Add MRP display if available */}
                                                    {/* <span className="text-xs text-gray-400 line-through ml-1">₹{item.mrp}</span> */}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Quantity Control & Remove */}
                                        <div className="flex items-center border border-green-600 rounded flex-shrink-0">
                                            <button
                                                onClick={() => updateQuantity(item.product, item.quantity - 1)}
                                                className="px-2 py-1 text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={item.quantity <= 1 || loading} // Disable if quantity is 1 or loading
                                            >
                                                {item.quantity === 1 ? <FaTrash size={12} /> : <FaMinus size={12} />}
                                            </button>
                                            <span className="px-3 py-1 text-sm font-medium text-green-700 min-w-[30px] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                                                className="px-2 py-1 text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={loading} // Disable if loading
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                         {/* Cancellation Policy */}
                         <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-4 rounded-lg shadow"
                         >
                            <h3 className="font-semibold text-[#251c1a] mb-2">Cancellation Policy</h3>
                            <p className="text-xs text-gray-500">
                                Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
                                {/* <Link to="/cancellation-policy" className="text-blue-600 hover:underline ml-1">Learn more</Link> */}
                            </p>
                         </motion.div>
                    </div>

                    {/* Bill Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white p-5 rounded-lg shadow sticky top-24"> {/* Sticky positioning */}
                            <h2 className="text-lg font-semibold text-[#251c1a] border-b pb-3 mb-4">Bill details</h2>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="flex items-center text-gray-600">
                                        <FaFileInvoiceDollar className="mr-2"/> Items total
                                        {parseFloat(totalSavings) > 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Saved ₹{totalSavings}</span>}
                                    </span>
                                    <span className="text-gray-800">
                                        {parseFloat(totalSavings) > 0 && <span className="line-through text-gray-400 mr-1">₹{itemsTotalMRP}</span>}
                                        ₹{cart.total_price}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center text-gray-600">
                                        <FaShoppingBag className="mr-2"/> Delivery charge
                                        <FaInfoCircle className="text-gray-400 ml-1 cursor-pointer" title="Delivery fee based on distance and order value"/>
                                    </span>
                                    <span className="text-gray-800">
                                        {parseFloat(cart.delivery_charge) > 0 ? `₹${cart.delivery_charge}` : <span className="text-green-600">FREE</span>}
                                        {/* Example original fee - adjust if needed */}
                                        {/* {parseFloat(cart.delivery_charge) === 0 && parseFloat(cart.total_price) < 500 && <span className="line-through text-gray-400 ml-1">₹25</span>} */} 
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center text-gray-600">
                                        <FaShoppingBag className="mr-2"/> Handling charge
                                        <FaInfoCircle className="text-gray-400 ml-1 cursor-pointer" title="Includes platform fees and packing charges"/>
                                    </span>
                                    <span className="text-gray-800">₹{cart.handling_charge}</span>
                                </div>
                            </div>
                            <div className="border-t border-dashed border-gray-300 my-4"></div>
                            <div className="flex justify-between font-semibold text-base text-[#251c1a] mb-5">
                                <span>Grand total</span>
                                <span>₹{cart.grand_total}</span>
                            </div>

                            {/* Savings Banner (Bottom) */}
                            {parseFloat(totalSavings) > 0 && (
                                <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-sm font-medium flex justify-between items-center mb-5">
                                    <span>Your total savings</span>
                                    <span>₹{totalSavings}</span>
                                </div>
                            )}

                            {/* Proceed Button */}
                            <button
                                onClick={() => user ? navigate('/checkout') : navigate('/signin')} // Navigate based on login status
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-between px-4 disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={loading} // Disable button while loading
                            >
                                <span className="flex items-center"><FaRupeeSign size={12} className="mr-0.5"/>{cart.grand_total} TOTAL</span>
                                <span>{user ? 'Proceed to Checkout' : 'Login to Proceed'} &gt;</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default CartPage;