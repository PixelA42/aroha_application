import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCreditCard, FaMoneyBillWave, FaRupeeSign, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { fetchCartApi, placeOrder } from '../api'; // Assuming api.js is in ../api
import { toast } from 'react-toastify';

// Placeholder for product images (similar to CartPage)
const getProductImage = (productIdentifier) => {
    if (productIdentifier && productIdentifier.startsWith('100')) {
        return 'https://via.placeholder.com/60x60.png?text=Choco+Bar';
    }
    return 'https://via.placeholder.com/60x60.png?text=Product';
}

function CheckoutPage() {
    const [cart, setCart] = useState(null);
    const [loadingCart, setLoadingCart] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD'); // Default to Cash on Delivery
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        const loadCart = async () => {
            if (!token) {
                toast.error("Please log in to proceed to checkout.");
                navigate('/signin');
                return;
            }
            setLoadingCart(true);
            setError(null);
            try {
                const cartData = await fetchCartApi();
                if (!cartData || cartData.items.length === 0) {
                    toast.info("Your cart is empty. Add items before checking out.");
                    navigate('/categories'); // Redirect if cart is empty
                } else {
                    setCart(cartData);
                }
            } catch (e) {
                console.error("Failed to fetch cart for checkout:", e);
                setError(e.message || "Failed to load cart details.");
                toast.error("Could not load cart details. Please try again.");
            } finally {
                setLoadingCart(false);
            }
        };
        loadCart();
    }, [token, navigate]);

    const handlePlaceOrder = async () => {
        if (!cart || placingOrder) return;

        setPlacingOrder(true);
        setError(null);
        toast.info("Placing your order...", { autoClose: false, toastId: 'placingOrder' }); // Show persistent notification

        try {
            const orderResponse = await placeOrder(selectedPaymentMethod);
            toast.dismiss('placingOrder'); // Dismiss the persistent notification
            toast.success(<>
                <FaCheckCircle className="inline mr-2" /> Order Placed Successfully! (ID: {orderResponse.order.id})
            </>);
            // Redirect to order history or a success page after a short delay
            setTimeout(() => {
                navigate('/order-history'); // Redirect to order history page
            }, 2000);
        } catch (e) {
            console.error("Failed to place order:", e);
            toast.dismiss('placingOrder');
            setError(e.message || "Failed to place order.");
            toast.error(<>
                <FaExclamationCircle className="inline mr-2" /> {e.message || "Failed to place order. Please try again."}
            </>);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loadingCart) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">Loading checkout details...</div>;
    }

    if (error && !cart) { // Show error if cart couldn't be loaded
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20 text-red-600">
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#251c1a] text-white rounded hover:bg-[#3a2e2b]">
                    Retry
                </button>
            </div>
        );
    }

    if (!cart) { // Should be handled by useEffect redirect, but as a fallback
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">Redirecting...</div>;
    }

    return (
        <section className="min-h-screen py-20 bg-gray-100 pt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-[#251c1a] mb-8 text-center"
                >
                    Checkout
                </motion.h1>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 border-b pb-4"
                    >
                        <h2 className="text-xl font-semibold text-[#251c1a] mb-4 flex items-center">
                            <FaShoppingCart className="mr-2 text-green-600" /> Order Summary
                        </h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {cart.items.map(item => (
                                <div key={item.product} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center space-x-2">
                                        <img src={getProductImage(item.product)} alt={item.product_name} className="w-10 h-10 object-contain border rounded flex-shrink-0" />
                                        <div>
                                            <p className="text-gray-800 font-medium">{item.product_name}</p>
                                            <p className="text-gray-500 text-xs">{item.unit_label} x {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t text-sm space-y-1">
                            <div className="flex justify-between"><span>Items Total:</span><span>₹{cart.total_price}</span></div>
                            <div className="flex justify-between"><span>Delivery:</span><span>₹{cart.delivery_charge}</span></div>
                            <div className="flex justify-between"><span>Handling:</span><span>₹{cart.handling_charge}</span></div>
                            <div className="flex justify-between font-bold text-base mt-2"><span>Grand Total:</span><span>₹{cart.grand_total}</span></div>
                        </div>
                    </motion.div>

                    {/* Payment Method */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <h2 className="text-xl font-semibold text-[#251c1a] mb-4 flex items-center">
                            <FaCreditCard className="mr-2 text-blue-600" /> Select Payment Method
                        </h2>
                        <div className="space-y-3">
                            {/* Cash on Delivery Option */}
                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === 'COD' ? 'border-green-600 bg-green-50 ring-2 ring-green-300' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={selectedPaymentMethod === 'COD'}
                                    onChange={() => setSelectedPaymentMethod('COD')}
                                    className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <FaMoneyBillWave className="mr-2 text-lg text-green-700" />
                                <span className="font-medium text-gray-800">Cash on Delivery (COD)</span>
                            </label>

                            {/* Online Payment Option (Placeholder/Disabled) */}
                            <label className={`flex items-center p-4 border rounded-lg cursor-not-allowed transition-all bg-gray-100 border-gray-300 opacity-60`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="ONLINE"
                                    checked={selectedPaymentMethod === 'ONLINE'}
                                    onChange={() => setSelectedPaymentMethod('ONLINE')}
                                    className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
                                    disabled // Disable online payment for now
                                />
                                <FaCreditCard className="mr-2 text-lg text-gray-500" />
                                <span className="font-medium text-gray-500">Online Payment (Coming Soon)</span>
                            </label>
                        </div>
                    </motion.div>

                    {/* Place Order Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button
                            onClick={handlePlaceOrder}
                            disabled={placingOrder || !selectedPaymentMethod}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {placingOrder ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    Place Order (Pay ₹{cart.grand_total})
                                </>
                            )}
                        </button>
                        {error && !placingOrder && ( // Show error message if placing order failed
                            <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default CheckoutPage;
