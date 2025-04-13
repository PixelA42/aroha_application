import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import FAQ from './components/FAQ'
import Services from './components/Services'
import Footer from './components/Footer'
import Testimonials from './components/Testimonials'
import Profile from './components/Profile'
import SignIn from './components/SignIn'
import Contact from './components/Contact'
import { motion, AnimatePresence } from 'framer-motion'

// Main content component that uses useNavigate
function MainContent() {
	const [user, setUser] = useState(null);
	const [showWelcome, setShowWelcome] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		// Check if user is logged in
		const loggedInUser = localStorage.getItem('user');
		if (loggedInUser) {
			setUser(JSON.parse(loggedInUser));
		}
	}, []);

	const handleSignIn = (userData) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
		setShowWelcome(true);
		navigate('/');
		// Hide welcome message after 5 seconds
		setTimeout(() => setShowWelcome(false), 5000);
	};

	const handleSignOut = () => {
		setUser(null);
		localStorage.removeItem('user');
		navigate('/');
	};

	return (
		<>
			<Navbar user={user} onSignOut={handleSignOut} />
			
			{/* Welcome Message */}
			<AnimatePresence>
				{showWelcome && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#251c1a] text-white px-6 py-3 rounded-full shadow-lg"
					>
						<span className="font-medium">Welcome back, {user?.name}! 👋</span>
					</motion.div>
				)}
			</AnimatePresence>

			<Routes>
				<Route path="/" element={
					<>
						<section id="hero">
							<Hero />
						</section>
						<section id="services">
							<Services />
						</section>
						<section id="about">
							<About />
						</section>
						<section id="testimonials">
							<Testimonials />
						</section>
						<section id="faq">
							<FAQ />
						</section>
						<section id="contact">
							<Contact />
						</section>
						<Footer />
					</>
				} />
				<Route path="/profile" element={user ? <Profile user={user} /> : <SignIn onSignIn={handleSignIn} />} />
				<Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
			</Routes>
		</>
	);
}

// Main App component that provides Router context
function App() {
	return (
		<Router>
			<MainContent />
		</Router>
	);
}

export default App;