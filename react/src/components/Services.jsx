import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Categories() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/categories'); // Change navigation target to /categories
  };

  const categories = [
    {
      title: 'Clothing',
      image: 'https://i.pinimg.com/564x/0b/7d/d6/0b7dd63ed28bf2ea96d9790a3d7b3ea4.jpg',
      alt: 'Traditional Indian Clothing',
      description: 'Explore beautifully crafted traditional Indian clothing from various regions.'
    },
    {
      title: 'Handicrafts',
      image: 'https://i.pinimg.com/474x/d0/79/2b/d0792b5c95c76e9d34e60fcc2c28d9d5.jpg',
      alt: 'Indian Handicrafts',
      description: 'Discover exquisite handicrafts that reflect India’s rich heritage and craftsmanship.'
    },
    {
      title: 'Jewelry',
      image: 'https://i.pinimg.com/474x/17/8d/24/178d24f43165605cbe9b0b177c04615c.jpg',
      alt: 'Indian Jewelry',
      description: 'Shop for stunning, handcrafted Indian jewelry that embodies timeless elegance.'
    },
    {
      title: 'Food',
      image: 'https://i.pinimg.com/474x/90/76/ff/9076ffe25767c5003290da18ff86b26b.jpg',
      alt: 'Indian Food',
      description: 'Taste the flavors of India with our selection of authentic food products.'
    },
    {
      title: 'Home Decor',
      image: 'https://i.pinimg.com/474x/d7/9a/23/d79a23c3a8b80f76eb507d0e3b7684d3.jpg',
      alt: 'Indian Home Decor',
      description: 'Enhance your home with artistic and traditional Indian decor pieces.'
    },
    {
      title: 'Accessories',
      image: 'https://i.pinimg.com/474x/0f/b4/d6/0fb4d66eba1f9aa83c02ceaba4969984.jpg',
      alt: 'Indian Accessories',
      description: 'Find unique and stylish accessories inspired by Indian culture and tradition.'
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Categories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Explore our diverse categories and embark on a journey through India’s vibrant heritage. 
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.alt} 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleShopNow} // This button now navigates to /categories
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default Categories;
