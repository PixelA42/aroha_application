import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUser, FaUsers, FaNetworkWired, FaGraduationCap, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ user, onSignOut }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (path) => {
        if (path.startsWith('/#')) {
            // Handle hash-based scrolling
            const sectionId = path.substring(2); // Remove '/#' from the path
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Handle regular routing
            navigate(path);
        }
        setIsOpen(false);
    };

    const navItems = [
        { name: 'Home', icon: null, path: '/' },
        { name: 'Categories', icon: null, path: '/#services' },
        { name: 'Deals', icon: null, path: '/#about' },
        { name: 'Testimonials', icon: null, path: '/#testimonials' },
        { name: 'FAQ', icon: null, path: '/#faq' },
        { name: 'Contact', icon: null, path: '/#contact' },
        ...(user ? [
            { name: user.name, icon: <FaUser />, path: '/profile' },
            { name: 'Sign Out', icon: <FaSignOutAlt />, onClick: onSignOut }
        ] : [
            { name: 'Sign In', icon: <FaUser />, path: '/signin' }
        ])
    ];

    const isActive = (path) => {
        if (path.startsWith('/#')) {
            // For hash links, check if we're on the home page
            return location.pathname === '/' && window.location.hash === path.substring(2);
        }
        return location.pathname === path;
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-6 sm:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => handleNavigation('/')}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#251c1a] to-[#3a2e2b] flex items-center justify-center">
                            <FaUsers className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#251c1a] to-[#3a2e2b] bg-clip-text text-transparent">
                            Aroha 
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item, index) => (
                            <motion.button
                                key={item.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={item.onClick || (() => handleNavigation(item.path))}
                                className={`flex items-center space-x-2 transition-colors duration-300 ${
                                    isActive(item.path) ? 'text-[#251c1a]' : 'text-[#251c1a]/70 hover:text-[#251c1a]'
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-[#251c1a]"
                    >
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-4">
                                {navItems.map((item, index) => (
                                    <motion.button
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={item.onClick || (() => handleNavigation(item.path))}
                                        className={`flex items-center space-x-3 w-full transition-colors duration-300 ${
                                            isActive(item.path) ? 'text-[#251c1a]' : 'text-[#251c1a]/70 hover:text-[#251c1a]'
                                        }`}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}

export default Navbar;