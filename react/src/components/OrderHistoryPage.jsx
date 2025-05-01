import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaCalendarAlt, FaRupeeSign, FaInfoCircle, FaShoppingBag, FaClipboardList } from 'react-icons/fa';
import { getOrderHistory } from '../api'; // Assuming api.js is in ../api
import { toast } from 'react-toastify';

// Placeholder for product images
const getProductImage = (productIdentifier) => {
    if (productIdentifier && productIdentifier.startsWith('100')) {
        return 'https://via.placeholder.com/40x40.png?text=Choco';
    }
    return 'https://via.placeholder.com/40x40.png?text=Prod';
}

// Helper to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper to get status color
const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING': return 'text-yellow-600 bg-yellow-100';
        case 'PROCESSING': return 'text-blue-600 bg-blue-100';
        case 'SHIPPED': return 'text-purple-600 bg-purple-100';
        case 'DELIVERED': return 'text-green-600 bg-green-100';
        case 'CANCELLED': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
    }
};

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const loadOrderHistory = async () => {
            if (!token) {
                toast.error("Please log in to view your order history.");
                navigate('/signin');
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const historyData = await getOrderHistory();
                setOrders(historyData);
            } catch (e) {
                console.error("Failed to fetch order history:", e);
                setError(e.message || "Failed to load order history.");
                toast.error("Could not load order history. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadOrderHistory();
    }, [token, navigate]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">Loading order history...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20 text-red-600">
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#251c1a] text-white rounded hover:bg-[#3a2e2b]">
                    Retry
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20">
                <FaClipboardList className="text-6xl text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-6">You haven't placed any orders yet.</p>
                <Link to="/categories" className="px-6 py-3 bg-[#251c1a] text-white rounded-lg hover:bg-[#3a2e2b] transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <section className="min-h-screen py-20 bg-gray-100 pt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-[#251c1a] mb-8 text-center"
                >
                    My Orders
                </motion.h1>

                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            {/* Order Header */}
                            <div className="flex flex-wrap justify-between items-center border-b pb-3 mb-4 gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-[#251c1a]">Order ID: #{order.id}</p>
                                    <p className="text-xs text-gray-500 flex items-center">
                                        <FaCalendarAlt className="mr-1" /> Placed on: {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                     <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status_display}
                                    </span>
                                    <p className="text-lg font-bold text-[#251c1a] flex items-center">
                                        <FaRupeeSign size={14} className="mr-0.5" />{order.total_amount}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-3">
                                            <img src={getProductImage(item.product_identifier)} alt={item.product_name} className="w-10 h-10 object-contain border rounded flex-shrink-0" />
                                            <div>
                                                <p className="text-gray-800 font-medium">{item.product_name}</p>
                                                <p className="text-gray-500 text-xs">{item.unit_label} x {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Order Footer */}
                            <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t">
                                <span>Payment: {order.payment_method_display}</span>
                                {/* Add more actions if needed, e.g., Track Order, View Details */}
                                {/* <Link to={`/order/${order.id}`} className="text-blue-600 hover:underline">View Details</Link> */}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default OrderHistoryPage;
