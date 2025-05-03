import React from 'react'; // Removed useEffect, useState
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { FaUser, FaEnvelope, FaBriefcase, FaGraduationCap, FaUsers, FaCalendarAlt, FaEdit, FaShoppingCart, FaHeart, FaStar, FaTags, FaClipboardList, FaExternalLinkAlt } from 'react-icons/fa'; // Added FaClipboardList, FaExternalLinkAlt

// Static data for the two recommended products
const staticRecommendations = [
  { id: 2, name: 'Banarasi Brocade Dupatta', price: 3200, image_url: 'https://i.pinimg.com/736x/e3/84/96/e38496598d613c2801c44ea0a7df798a.jpg' },
  { id: 3, name: 'Pashmina Shawl from Kashmir', price: 15000, image_url: 'https://i.pinimg.com/736x/84/4c/c1/844cc13741a3893b60ddb792fd88038e.jpg' },
];


function Profile({ user }) {
    const navigate = useNavigate(); // Initialize navigate

    // Removed useEffect for fetching recommendations

    const handleViewProduct = (productId) => {
        navigate(`/products/${productId}`); // Navigate to product detail page
    };

    if (!user) {
        // ... existing code for non-logged-in user ...
        return (
            <section className="min-h-screen py-20 bg-[#f3eee5] relative overflow-hidden">
                <div className="container mx-auto px-6 sm:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-bold text-[#251c1a] mb-4">Please Sign In</h2>
                        <p className="text-[#251c1a]/70 mb-8">
                            Sign in to view your personalized profile and dashboard.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/signin')} // Use navigate instead of window.location
                            className="bg-[#251c1a] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#251c1a]/90 transition-colors duration-300"
                        >
                            Sign In Now
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen py-20 bg-[#f3eee5] relative overflow-hidden pt-24"> {/* Added pt-24 */}
            {/* ... existing animated background patterns ... */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYuMjUgMzUuMjVhMi4yNSAyLjI1IDAgMTAwLTQuNSAyLjI1IDIuMjUgMCAwMDAgNC41eiIgZmlsbD0iIzI1MWMxYSIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+\')] opacity-10\"></div>
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

            <div className="container mx-auto px-6 sm:px-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    {/* ... existing profile header code ... */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#251c1a] to-[#3a2e2b] flex items-center justify-center mx-auto">
                                <FaUser className="text-6xl text-white" />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg"
                            >
                                <FaEdit className="text-[#251c1a]" />
                            </motion.button>
                        </div>
                        <h2 className="text-4xl font-bold text-[#251c1a] mb-4">
                            Welcome back, {user.name}!
                        </h2>
                        <p className="text-[#251c1a]/70">
                            Manage your profile and track your professional journey
                        </p>
                    </motion.div>

                    {/* Profile Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        {/* ... existing personal info code ... */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <h3 className="text-2xl font-bold text-[#251c1a] mb-6">Personal Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#251c1a]/10 flex items-center justify-center">
                                        <FaUser className="text-[#251c1a]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#251c1a]/60">Full Name</p>
                                        <p className="font-medium text-[#251c1a]">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#251c1a]/10 flex items-center justify-center">
                                        <FaEnvelope className="text-[#251c1a]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#251c1a]/60">Email</p>
                                        <p className="font-medium text-[#251c1a]">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* E-commerce Stats & Actions */}
                        {/* ... existing e-commerce stats code ... */}
                         <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <h3 className="text-2xl font-bold text-[#251c1a] mb-6">My Account</h3>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-xl bg-[#251c1a]/10 flex items-center justify-center mx-auto mb-4">
                                        <FaHeart className="text-2xl text-[#251c1a]" />
                                    </div>
                                    <p className="text-3xl font-bold text-[#251c1a] mb-1">0</p>
                                    <p className="text-sm text-[#251c1a]/60">Wishlist Items</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-xl bg-[#251c1a]/10 flex items-center justify-center mx-auto mb-4">
                                        <FaStar className="text-2xl text-[#251c1a]" />
                                    </div>
                                    <p className="text-3xl font-bold text-[#251c1a] mb-1">0</p>
                                    <p className="text-sm text-[#251c1a]/60">Products Reviewed</p>
                                </div>
                                <Link to="/cart" className="block text-center group">
                                    <div className="w-16 h-16 rounded-xl bg-[#251c1a]/10 group-hover:bg-[#251c1a]/20 flex items-center justify-center mx-auto mb-4 transition-colors">
                                        <FaShoppingCart className="text-2xl text-[#251c1a]" />
                                    </div>
                                    <p className="text-sm text-[#251c1a]/60 group-hover:text-[#251c1a]">Items in Cart</p>
                                </Link>
                            </div>
                             {/* Add other links/actions if needed */}
                        </motion.div>
                    </div>

                    {/* Recent Activity */}
                    {/* ... existing recent activity code ... */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-8 bg-white rounded-2xl shadow-xl p-8"
                    >
                        <h3 className="text-2xl font-bold text-[#251c1a] mb-6">Recent Activity</h3>
                        <div className="text-center py-8">
                            <p className="text-[#251c1a]/60">No recent activity to show</p>
                        </div>
                    </motion.div>

                    {/* My Orders Section */}
                    {/* ... existing orders section code ... */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }} // Adjusted delay
                        className="mt-8 bg-white rounded-2xl shadow-xl p-8"
                    >
                        <h3 className="text-2xl font-bold text-[#251c1a] mb-6">My Orders</h3>
                        <div className="text-center">
                             <Link to="/order-history" className="inline-flex items-center space-x-2 bg-[#251c1a]/10 hover:bg-[#251c1a]/20 text-[#251c1a] px-6 py-3 rounded-lg font-medium transition-colors">
                                <FaClipboardList />
                                <span>View Order History</span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Recommendations Section - UPDATED */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }} // Adjusted delay
                        className="mt-8 bg-white rounded-2xl shadow-xl p-8"
                    >
                        <h3 className="text-2xl font-bold text-[#251c1a] mb-6">Recommended for You</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8"> {/* Adjusted grid columns */}
                            {staticRecommendations.map((prod) => (
                                <motion.div
                                    key={prod.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col" // Card styling
                                >
                                    <img
                                        src={prod.image_url}
                                        alt={prod.name}
                                        className="w-full h-64 object-cover" // Image styling
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300.png?text=Image+Not+Found'; /* Fallback image */ }}
                                    />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h4 className="text-lg font-semibold text-[#251c1a] mb-2 flex-grow">{prod.name}</h4>
                                        <p className="text-xl font-bold text-[#d97706] mb-4">₹{prod.price}</p>
                                        <button
                                            className="mt-auto w-full border border-[#d97706] text-[#d97706] py-2 px-4 rounded-md hover:bg-[#fffaf0] transition-colors flex items-center justify-center space-x-2"
                                            onClick={() => handleViewProduct(prod.id)} // Use handler
                                        >
                                            <span>View Product</span>
                                            <FaExternalLinkAlt size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    {/* End Recommendations Section */}

                </div>
            </div>
        </section>
    );
}

export default Profile;