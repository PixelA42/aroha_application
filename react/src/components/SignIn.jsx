import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaTimes } from 'react-icons/fa';

function SignIn({ onSignIn }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isSignUp) {
                // Sign Up validation
                if (!formData.name || !formData.email || !formData.password) {
                    setError('All fields are required');
                    return;
                }

                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }

                // Check if user exists
                const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
                if (existingUsers.some(user => user.email === formData.email)) {
                    setError('Email already registered');
                    return;
                }

                // Create new user
                const newUser = {
                    id: Date.now(),
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=251c1a&color=fff`,
                    headline: 'Member at Udyam',
                    connections: [],
                    posts: [],
                    joinedDate: new Date().toISOString()
                };

                // Save to localStorage
                localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));

                // Sign in the new user
                const userData = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    image: newUser.image,
                    headline: newUser.headline,
                    connections: newUser.connections,
                    posts: newUser.posts,
                    joinedDate: newUser.joinedDate
                };

                onSignIn(userData);
            } else {
                // Sign In validation
                if (!formData.email || !formData.password) {
                    setError('Email and password are required');
                    return;
                }

                // Check credentials
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === formData.email && u.password === formData.password);

                if (!user) {
                    setError('Invalid email or password');
                    return;
                }

                // Sign in the user
                const userData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    headline: user.headline,
                    connections: user.connections,
                    posts: user.posts,
                    joinedDate: user.joinedDate
                };

                onSignIn(userData);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Auth error:', err);
        }
    };

    return (
        <section id="login" className="min-h-screen py-20 bg-[#f3eee5] relative overflow-hidden">
            {/* Animated background patterns */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYuMjUgMzUuMjVhMi4yNSAyLjI1IDAgMTAwLTQuNSAyLjI1IDIuMjUgMCAwMDAgNC41eiIgZmlsbD0iIzI1MWMxYSIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
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
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[#251c1a] mb-2">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-[#251c1a]/70">
                                {isSignUp ? 'Join our community of professionals' : 'Sign in to continue'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 flex items-center justify-between"
                            >
                                <span>{error}</span>
                                <button onClick={() => setError('')}>
                                    <FaTimes className="text-red-500" />
                                </button>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isSignUp && (
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#251c1a]/40" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full pl-12 pr-4 py-3 border border-[#251c1a]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#251c1a]/30"
                                        required
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#251c1a]/40" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    className="w-full pl-12 pr-4 py-3 border border-[#251c1a]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#251c1a]/30"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#251c1a]/40" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full pl-12 pr-4 py-3 border border-[#251c1a]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#251c1a]/30"
                                    required
                                />
                            </div>

                            {isSignUp && (
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#251c1a]/40" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm Password"
                                        className="w-full pl-12 pr-4 py-3 border border-[#251c1a]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#251c1a]/30"
                                        required
                                    />
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-[#251c1a] text-white py-3 rounded-xl font-medium hover:bg-[#251c1a]/90 transition-colors duration-300 flex items-center justify-center space-x-2"
                            >
                                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                                <FaArrowRight />
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError('');
                                    setFormData({
                                        name: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: ''
                                    });
                                }}
                                className="text-[#251c1a]/70 hover:text-[#251c1a] transition-colors duration-300"
                            >
                                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default SignIn; 