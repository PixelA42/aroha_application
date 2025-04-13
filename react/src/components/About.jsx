import React from "react";
import { motion } from "framer-motion";

const offers = [
  {
    title: "Today's Deals – Upto 40% Off!",
    description: "Grab the best deals on fashion, and home decor.",
    image: "https://i.pinimg.com/736x/8c/85/24/8c85249192c21449c01d05278c69295a.jpg",
  },
  {
    title: "End of Season Sale – Flat 30% Off!",
    description: "Refresh your wardrobe with our latest collection at discounted prices.",
    image: "https://i.pinimg.com/736x/cd/d3/11/cdd31136916db9b6e4dd380db94ceab8.jpg",
  },
  {
    title: "\"House of Indya Specials\" – 25% Off!",
    description: "Discover House Of Indya wear with a modern twist at exclusive prices.",
    image: "https://i.pinimg.com/736x/73/4a/ef/734aef3b975210d2bdb1711a2505ad7b.jpg",
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
