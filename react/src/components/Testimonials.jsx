import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ananya Sharma',
    role: 'Customer',
    company: 'Handloom Buyer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    quote: 'Aroha brings the best of Indian handicrafts! The saree I bought was authentic and beautifully woven. Truly supporting artisans!',
    rating: 5
  },
  {
    name: 'Raj Malhotra',
    role: 'Vendor',
    company: 'Rajasthan Handicrafts',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    quote: 'Aroha helped me take my handmade wooden crafts to a nationwide audience. My sales have increased by 300%!',
    rating: 5
  },
  {
    name: 'Meera Iyer',
    role: 'Customer',
    company: 'Spices Enthusiast',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    quote: 'The organic masalas I ordered were fresh and aromatic. Aroha is my go-to for authentic Indian spices!',
    rating: 5
  },
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-br from-[#f3eee5] via-[#e2dac9] to-[#f0ebdf] py-20 px-6 overflow-hidden">
      <div className="container mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#251c1a]">Aroha Community Voices</h2>
          <div className="h-1 w-24 bg-[#b19f84] mx-auto mb-5"></div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[#251c1a]/70 text-lg max-w-2xl mx-auto">
            Real stories from customers and vendors who trust Aroha for authentic Indian goods.
          </motion.p>
        </div>

        <div className="relative h-[400px] mx-auto max-w-6xl">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${index === activeIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-95'}`}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
                <div className="flex justify-center mb-4">
                  <img className="w-20 h-20 rounded-full object-cover border-4 border-[#b19f84]" src={testimonial.image} alt={testimonial.name} />
                </div>
                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                <div className="flex justify-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < testimonial.rating ? 'text-[#b19f84]' : 'text-gray-300'} />
                  ))}
                </div>
                <h3 className="text-xl font-bold">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.role}, {testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === activeIndex ? 'bg-[#251c1a]' : 'bg-[#251c1a]/30'}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
