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

        const fieldErrors = {};

        // Frontend quick checks
        if (!formData.email || !formData.password || (isSignUp && (!formData.name || !formData.confirmPassword))) {
            setError('Please fill in all fields.');
            return;
        }

        if (isSignUp && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const url = isSignUp
                ? 'http://127.0.0.1:8000/api/auth/signup/'
                : 'http://127.0.0.1:8000/api/auth/signin/';
            
            const payload = isSignUp
                ? {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                  }
                : {
                    email: formData.email,
                    password: formData.password
                  };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                // Backend validation errors from DRF
                if (data && data.errors) {
                    const messages = [];
                    for (const [field, messagesArray] of Object.entries(data.errors)) {
                        messages.push(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${messagesArray.join(' ')}`);
                    }
                    setError(messages.join(' | '));
                } else if (data && data.message) {
                    setError(data.message);
                } else {
                    setError('Something went wrong. Please try again.');
                }
                return;
            }

            // Success logic
            if (isSignUp) {
                localStorage.setItem('user', JSON.stringify(data.data));
                onSignIn(data.data);
            } else {
                const isNewToken = data.data.is_new_token;
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                onSignIn(data.data.user);
                console.log(isNewToken ? 'New token created' : 'Token retrieved');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Auth error:', err);
        }
    };

    return (
        <section id="login" className="min-h-screen py-20 bg-[#f3eee5] relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
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
                                {isSignUp ? 'Join our community' : 'Sign in to continue'}
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

