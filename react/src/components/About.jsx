import React from "react";
import { motion } from "framer-motion";

const offers = [
  {
    title: "Diwali Delights – Upto 40% Off!",
    description: "Celebrate with exclusive discounts on handcrafted decor, sweets, and festive attire.",
    image: "https://i.pinimg.com/474x/7d/c3/53/7dc3531a907f14f26882a1a93de6a06f.jpg",
  },
  {
    title: "Holi Colors Sale – Flat 30% Off!",
    description: "Splash into savings with discounts on organic colors, ethnic wear, and sweets.",
    image: "https://i.pinimg.com/474x/9f/e5/af/9fe5afc7fc6ad933ae893e32d551158f.jpg",
  },
  {
    title: "Christmas Specials – 25% Off!",
    description: "Enjoy festive deals on handmade gifts, winter wear, and more.",
    image: "https://i.pinimg.com/474x/91/12/f7/9112f761a0754a533ab701fbc70a17be.jpg",
  },
];

const FestiveOffers = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Festive & Seasonal Offers</h2>
          <p className="text-gray-600 mt-2">Don't miss out on our special festive discounts!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div key={index} className="relative group w-full h-80 overflow-hidden rounded-xl shadow-lg">
              {/* Background Image */}
              <motion.img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover absolute"
                initial={{ y: 0 }}
                whileHover={{ y: -100 }} // Move up on hover
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {/* Hidden Content (Revealed on Hover) */}
              <motion.div
                className="absolute w-full h-full bg-[#f3eee5] flex flex-col items-center justify-center text-center px-6 opacity-0 group-hover:opacity-100"
                initial={{ y: 100 }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <h3 className="text-2xl font-bold text-gray-900">{offer.title}</h3>
                <p className="text-gray-700 mt-2">{offer.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestiveOffers;
