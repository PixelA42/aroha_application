import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Aroha?",
      answer: "Aroha is an eCommerce marketplace that showcases and delivers authentic Indian products from North, South, East, and West India. We connect artisans and local vendors with customers looking for unique, high-quality items."
    },
    {
      question: "How can I sell my products on Aroha?",
      answer: "Selling on Aroha is easy! Simply register as a vendor, list your products, and start reaching customers across India and beyond. Our platform provides tools to manage inventory, process orders, and track shipments."
    },
    {
      question: "What kind of products can I find on Aroha?",
      answer: "Aroha offers a diverse range of Indian products, including handcrafted goods, textiles, spices, home decor, ethnic wear, and much more. We bring the best of India to your doorstep."
    },
    {
      question: "Is there a return policy?",
      answer: "Yes, we have a customer-friendly return policy. If you're not satisfied with a product, you can request a return or exchange within the specified period, subject to our return guidelines."
    },
    {
      question: "How does Aroha ensure product authenticity?",
      answer: "We work directly with artisans and trusted vendors to ensure every product meets high-quality standards. Our team verifies products to maintain authenticity and preserve India's rich cultural heritage."
    }
  ];

  return (
    <section className="py-20 bg-[#f3eee5] relative overflow-hidden">
      {/* Animated background patterns */}
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
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-[#251c1a] mb-6 relative"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#251c1a]/70 text-lg max-w-2xl mx-auto"
          >
            Find answers to common questions about Aroha and how we bring India's best products to you.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Question */}
                <motion.button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#251c1a] to-[#3a2e2b] flex items-center justify-center">
                        <FaQuestionCircle className="text-xl text-white" />
                      </div>
                    </div>
                    <span className="text-lg font-medium text-[#251c1a]">{faq.question}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-[#251c1a]/60" />
                  </motion.div>
                </motion.button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-[#251c1a]/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
