import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';

// Placeholder product data - replace with actual data fetching later
// NOTE: Replace the placeholder Freepik URLs below with actual image URLs
//       sourced from Freepik.com or Snapstock.io that match the products.
const dummyProducts = {
  'Handloom Textiles': [
    // Added category and brand, ensured units/price structure
    { id: 1, name: 'Kanjeevaram Silk Saree', category: 'Handloom Textiles', brand: 'Traditional Weaves', price: 8500, image: 'https://i.pinimg.com/736x/1f/4c/e2/1f4ce28b6da6631e29ac0539639ec07f.jpg', description: 'Authentic Kanjeevaram silk saree with intricate zari work.', units: [{ label: 'Standard', price: 8500, mrp: 9000 }] },
    { id: 2, name: 'Banarasi Brocade Dupatta', category: 'Handloom Textiles', brand: 'Banaras Heritage', price: 3200, image: 'https://i.pinimg.com/736x/e3/84/96/e38496598d613c2801c44ea0a7df798a.jpg', description: 'Luxurious Banarasi brocade dupatta with floral patterns.', units: [{ label: 'Standard', price: 3200, mrp: 3500 }] },
    { id: 3, name: 'Pashmina Shawl from Kashmir', category: 'Handloom Textiles', brand: 'Kashmir Looms', price: 15000, image: 'https://i.pinimg.com/736x/84/4c/c1/844cc13741a3893b60ddb792fd88038e.jpg', description: 'Handwoven pure Pashmina shawl, soft and warm.', units: [{ label: 'Standard', price: 15000, mrp: 16500 }] },
    { id: 4, name: 'Ikat Cotton Kurta Material', category: 'Handloom Textiles', brand: 'Orissa Handlooms', price: 1800, image: 'https://i.pinimg.com/736x/6d/13/1c/6d131c10a75a16847666d9e060dcf9cf.jpg', description: 'Authentic Ikat weave cotton material for kurtas.', units: [{ label: 'Per Meter', price: 1800, mrp: 1950 }] },
    { id: 101, name: 'Khadi Cotton Kurta', category: 'Handloom Textiles', brand: 'Swadeshi Threads', price: 2500, image: 'https://i.pinimg.com/736x/89/d9/40/89d9404958832ffae5c830deca4f0055.jpg', description: 'Handspun Khadi cotton kurta for men.', units: [{ label: 'Standard', price: 2500, mrp: 2700 }] },
    { id: 102, name: 'Handloom Dhoti with Border', category: 'Handloom Textiles', brand: 'Traditional Attire', price: 2200, image: 'https://i.pinimg.com/736x/f8/78/98/f87898c6aef84df5cacb80eeb46a89eb.jpg', description: 'Cotton handloom dhoti with traditional border.', units: [{ label: 'Standard', price: 2200, mrp: 2400 }] },
    { id: 103, name: 'Silk Nehru Jacket', category: 'Handloom Textiles', brand: 'Ethnic Elegance', price: 7500, image: 'https://i.pinimg.com/736x/74/b4/a7/74b4a7170b2dbdadc95d5b51e0eddbf4.jpg', description: 'Elegant silk Nehru jacket for festive occasions.', units: [{ label: 'Standard', price: 7500, mrp: 8000 }] },
    { id: 104, name: 'Men\'s Retro Art Print Casual Shirt', category: 'Handloom Textiles', brand: 'Modern Prints', price: 1800, image: 'https://img.fantaskycdn.com/4c4b5be03fdd4e4afb4e04024b19be66_900x.jpeg', description: 'Casual shirt with a retro art print.', units: [{ label: 'Standard', price: 1800, mrp: 1950 }] },
  ],
  'Handicrafts': [
    // Added category, ensured units/price structure
    { id: 5, name: 'Jute Tote Bag', category: 'Handicrafts', brand: 'Sustainable Crafts', price: 250, image: 'https://i.pinimg.com/736x/36/a7/4d/36a74d5de2df283c013c0a218bf6c648.jpg', description: 'Eco-friendly jute bags, perfect for shopping.', units: [{ label: '1 Piece', price: 250, discount: 5, mrp: 263 }] },
    { id: 6, name: 'Handwoven Cotton Dhurrie', category: 'Handicrafts', brand: 'Cultural Weaves', price: 750, image: 'https://i.pinimg.com/736x/67/93/31/6793311cdeae9fd07bb683348e14688b.jpg', description: 'Handwoven cotton dhurrie, adds ethnic charm.', units: [{ label: '1 Mat', price: 750, discount: 10, mrp: 833 }] },
    { id: 7, name: 'Wooden Wall Hanging', category: 'Handicrafts', brand: 'Home Decor', price: 300, image: 'https://i.pinimg.com/736x/f1/eb/96/f1eb96ceae299ea8a54e93b3bece0fbd.jpg', description: 'Stylish wooden wall decor with intricate carving.', units: [{ label: '1 Piece', price: 300, discount: 0, mrp: 300 }] },
    { id: 8, name: 'Handcrafted Storage Pots', category: 'Handicrafts', brand: 'Shilpa Handicrafts', price: 400, image: 'https://i.pinimg.com/736x/9b/21/f8/9b21f8dbd5e3190744215181837720e3.jpg', description: 'Storage for Spices', units: [{ label: '1 Pair', price: 400, discount: 5, mrp: 421 }] },
    { id: 105, name: 'Peacock Handmade Collectibles', category: 'Handicrafts', brand: 'Jaipur Pottery', price: 950, image: 'https://i.pinimg.com/736x/fa/e7/9a/fae79afca25c79a1fbc1a05ad0b6e933.jpg', description: 'Beautiful decorative Peacock Handmade Collectible.', units: [{ label: '1 Vase', price: 950, discount: 8, mrp: 1033 }] },
    { id: 106, name: 'Bidriware Box', category: 'Handicrafts', brand: 'Bidar Metals', price: 1100, image: 'https://i.pinimg.com/736x/13/92/c9/1392c9e17121155c6e15b57238f59d6f.jpg', description: 'Intricately designed metal inlay box from Bidar.', units: [{ label: '1 Box', price: 1100, discount: 10, mrp: 1222 }] },
    { id: 107, name: 'Clay Candles', category: 'Handicrafts', brand: 'Mithila Arts', price: 800, image: 'https://i.pinimg.com/736x/57/fb/d3/57fbd3b79de754fc992a23deda390f42.jpg', description: 'Small, rustic candle holders crafted from terracotta clay. ', units: [{ label: '1 Painting', price: 800, discount: 5, mrp: 842 }] },
    { id: 108, name: 'Terracotta Horse Figurine', category: 'Handicrafts', brand: 'Maavi Designs', price: 500, image: 'https://i.pinimg.com/736x/9d/7c/de/9d7cde0d247542c0e97ec639b55978d7.jpg', description: 'Iconic terracotta clay horse figurine from Bishnupur.', units: [{ label: '1 Figurine', price: 500, discount: 0, mrp: 500 }] },
  ],
  'Ayurvedic Products': [
    // Added category, ensured units/price structure
    { id: 9, name: 'Neem & Tulsi Face Wash', category: 'Ayurvedic Products', brand: 'Veda Essentials', price: 250, image: 'https://i.pinimg.com/736x/8b/2f/2e/8b2f2ea39c8bc00f719c038411bedf0f.jpg', description: 'Herbal face wash for clear and healthy skin.', units: [{ label: '100 ml', price: 250, discount: 10, mrp: 278 }] },
    
    { id: 109, name: 'Alovera Gel', category: 'Ayurvedic Products', brand: 'Kiayat', price: 180, image: 'https://i.pinimg.com/736x/26/3b/4f/263b4f605653b1cb3ce2c770909755f5.jpg', description: 'Pure Aloe Vera Gel for deeply moisturized and healthy skin.', units: [{ label: '100 g', price: 180, discount: 8, mrp: 196 }] },
    { id: 110, name: 'Brahmi Hair Oil', category: 'Ayurvedic Products', brand: 'Kerala Ayurveda', price: 320, image: 'https://i.pinimg.com/736x/d4/e9/70/d4e97008d8ec92bb13024639ff3e7399.jpg', description: 'Nourishing hair oil infused with Brahmi herbs.', units: [{ label: '100 ml', price: 320, discount: 10, mrp: 356 }] },
    { id: 111, name: 'Chyawanprash Health Tonic', category: 'Ayurvedic Products', brand: 'Dabur', price: 350, image: 'https://i.pinimg.com/736x/cd/5e/fb/cd5efb17486d938650ab647f67f53815.jpg', description: 'Traditional Ayurvedic immunity booster paste.', units: [{ label: '500 g', price: 350, discount: 5, mrp: 368 }] },
    { id: 112, name: 'Kumkumadi Facial Oil', category: 'Ayurvedic Products', brand: 'Kama Ayurveda', price: 900, image: 'https://i.pinimg.com/736x/86/f1/55/86f155871ea524dc7799e1b73f9e399c.jpg', description: 'Luxurious, radiance-boosting facial oil.', units: [{ label: '12 ml', price: 900, discount: 10, mrp: 1000 }] },
    { id: 113, name: 'Herbal Toothpaste', category: 'Ayurvedic Products', brand: 'Patanjali', price: 120, image: 'https://i.pinimg.com/736x/64/68/fd/6468fdfc247453eed554efd78e353630.jpg', description: 'Natural dental care with Ayurvedic herbs.', units: [{ label: '100 g', price: 120, discount: 0, mrp: 120 }] },
    { id: 114, name: 'Shatavari Capsules', category: 'Ayurvedic Products', brand: 'Organic India', price: 400, image: 'https://i.pinimg.com/736x/b4/c7/74/b4c77431b7fd913e6e002af98b8dee49.jpg', description: 'Ayurvedic supplement for women\'s health.', units: [{ label: '60 Capsules', price: 400, discount: 12, mrp: 455 }] },
  ],
  'Indian Spices & Masalas': [
    // Added category and brand, ensured units/price structure
    { id: 11, name: 'Kerala Cardamom (Elaichi)', category: 'Indian Spices & Masalas', brand: 'Spice Route', price: 300, image: 'https://i.pinimg.com/736x/92/cc/08/92cc08b2680bd9e925e1b5a4cc9589ff.jpg', description: 'Aromatic green cardamom pods from Kerala.', units: [{ label: '50g', price: 300, mrp: 320 }] },
    { id: 12, name: 'Kashmiri Saffron (Kesar)', category: 'Indian Spices & Masalas', brand: 'Spice Route', price: 800, image: 'https://i.pinimg.com/736x/de/fe/41/defe41dc000aff205aa02b7f027e281e.jpg', description: 'Premium quality saffron threads from Kashmir.', units: [{ label: '1g', price: 800, mrp: 850 }] },
    { id: 13, name: 'Garam Masala Blend', category: 'Indian Spices & Masalas', brand: 'Spice Route', price: 150, image: 'https://i.pinimg.com/736x/d8/08/67/d8086717ddb99498e28c7bfd69f7f8f5.jpg', description: 'Traditional blend of aromatic Indian spices.', units: [{ label: '100g', price: 150, mrp: 160 }] },
    { id: 115, name: 'Turmeric Powder (Haldi)', category: 'Indian Spices & Masalas', brand: 'Spice Route', price: 90, image: 'https://i.pinimg.com/736x/a4/6d/cb/a46dcb531e698d50fce6a22399a4122e.jpg', description: 'Pure ground turmeric powder.', units: [{ label: '200g', price: 90, mrp: 100 }] },
    { id: 116, name: 'Cumin Seeds (Jeera)', category: 'Indian Spices & Masalas', brand: 'Spice Route', price: 70, image: 'https://i.pinimg.com/736x/29/9f/3d/299f3d111ff1f669471faab42f659d67.jpg', description: 'Whole cumin seeds, essential for Indian cooking.', units: [{ label: '100g', price: 70, mrp: 75 }] },
    { id: 117, name: 'Coriander Powder (Dhania)', category: 'Indian Spices & Masalas', brand: 'Spice Route', price: 80, image: 'https://i.pinimg.com/736x/0b/48/b8/0b48b892e49dadcd98f68d813c96c9f5.jpg', description: 'Ground coriander powder.', units: [{ label: '200g', price: 80, mrp: 85 }] },
    { id: 118, name: 'Red Chilli Powder (Lal Mirch)', category: 'Indian Spices & Masalas', brand: 'Spice Route', price: 110, image: 'https://i.pinimg.com/736x/12/a6/81/12a681235b73c6701a77dfd2d3bc2a74.jpg', description: 'Hot red chilli powder.', units: [{ label: '200g', price: 110, mrp: 120 }] },
    { id: 119, name: 'Asafoetida (Hing)', category: 'Indian Spices & Masalas', brand: 'Spice Route', price: 130, image: 'https://i.pinimg.com/736x/7a/a0/cf/7aa0cf91eac924547b0cab1edf08232a.jpg', description: 'Strong aromatic asafoetida powder.', units: [{ label: '50g', price: 130, mrp: 140 }] },
  ],
  'Ethnic Jewelry': [
      // Added category and brand, ensured units/price structure
      { id: 14, name: 'Kundan Necklace Set', category: 'Ethnic Jewelry', brand: 'Royal Jewels', price: 5500, image: 'https://i.pinimg.com/736x/17/28/21/172821b38d0cd5e92e5124ebfb02a182.jpg', description: 'Elegant Kundan stone necklace set with matching earrings.', units: [{ label: '1 Set', price: 5500, mrp: 6000 }] },
      { id: 15, name: 'Silver Jhumka Earrings', category: 'Ethnic Jewelry', brand: 'Silver Linings', price: 1800, image: 'https://i.pinimg.com/736x/4e/67/29/4e6729a82fe9130f81b03360be086ea9.jpg', description: 'Traditional silver jhumka earrings with intricate details.', units: [{ label: '1 Pair', price: 1800, mrp: 1950 }] },
      { id: 120, name: 'Meenakari Bangles', category: 'Ethnic Jewelry', brand: 'Jaipur Colors', price: 200, image: 'https://i.pinimg.com/736x/3c/05/e9/3c05e926bced1e96ce517cd038707c99.jpg', description: 'Colorful Meenakari enamel work bangles.', units: [{ label: 'Set of 4', price: 2200, mrp: 2400 }] },
      { id: 121, name: 'Temple Jewellery Pendant', category: 'Ethnic Jewelry', brand: 'Divine Collections', price: 3500, image: 'https://i.pinimg.com/736x/c7/e1/1f/c7e11fd40e25e991cc8628e591de7d74.jpg', description: 'Gold-plated temple jewellery pendant with deity motif.', units: [{ label: '1 Piece', price: 3500, mrp: 3800 }] },
      { id: 122, name: 'Oxidized Silver Nose Pin', category: 'Ethnic Jewelry', brand: 'Tribal Trends', price: 450, image: 'https://i.pinimg.com/736x/0e/cc/fc/0eccfc2c57b54d4fd3f805c574784c94.jpg', description: 'Stylish oxidized silver nose pin.', units: [{ label: '1 Piece', price: 450, mrp: 500 }] },
      { id: 123, name: 'Beaded Tribal Necklace', category: 'Ethnic Jewelry', brand: 'Tribal Trends', price: 950, image: 'https://i.pinimg.com/736x/ab/c6/81/abc6817e7d2921c08edff88b2ae8baf5.jpg', description: 'Handmade beaded necklace with tribal design.', units: [{ label: '1 Piece', price: 950, mrp: 1050 }] },
      { id: 124, name: 'Polki Maang Tikka', category: 'Ethnic Jewelry', brand: 'Royal Jewels', price: 2800, image: 'https://i.pinimg.com/736x/e8/70/dc/e870dcb5089a0053dee7d252e7fd9408.jpg', description: 'Traditional Polki stone Maang Tikka for forehead.', units: [{ label: '1 Piece', price: 2800, mrp: 3000 }] },
      { id: 125, name: 'Lac Bangles Set', category: 'Ethnic Jewelry', brand: 'Jaipur Colors', price: 600, image: 'https://i.pinimg.com/736x/d8/c8/b4/d8c8b4fb8d3c211c2c1912c0048ed961.jpg', description: 'Set of traditional Lac bangles from Rajasthan.', units: [{ label: 'Set of 12', price: 600, mrp: 650 }] },
  ],
  'Home Decor': [
    // Added category and brand, ensured units/price structure
    { id: 16, name: 'Brass lotus Chandelier', category: 'Home Decor', brand: 'Artisan Lights', price: 1750, image: 'https://i.pinimg.com/736x/53/c8/71/53c871fb47c1ee7b726cc601c51cb653.jpg', description: 'Elegant brass chandelier with lotus design.', units: [{ label: '1 Piece', price: 1750, mrp: 1900 }] },
    { id: 17, name: 'Madhubani Wall Painting', category: 'Home Decor', brand: 'Mithila Arts', price: 1500, image: 'https://i.pinimg.com/736x/bf/fc/83/bffc83561bd14fe63043548ce401ceb1.jpg', description: 'Hand-painted Madhubani art for wall decoration.', units: [{ label: '1 Piece', price: 1500, mrp: 1650 }] },
    { id: 126, name: 'Block Print Cushion Covers', category: 'Home Decor', brand: 'Jaipur Prints', price: 400, image: 'https://i.pinimg.com/736x/24/aa/f1/24aaf19d8998ab4f7f6cf1e701c96b6b.jpg', description: 'Set of cotton cushion covers with block prints.', units: [{ label: 'Set of 2', price: 400, mrp: 450 }] },
    { id: 127, name: 'Marble Inlay Coasters', category: 'Home Decor', brand: 'Agra Crafts', price: 650, image: 'https://i.pinimg.com/736x/03/c2/0c/03c20c10e777e42164b54b53e5c3c040.jpg', description: 'Set of marble coasters with intricate inlay work.', units: [{ label: 'Set of 4', price: 650, mrp: 700 }] },
    { id: 128, name: 'Pattachitra Wall Plate', category: 'Home Decor', brand: 'Orissa Arts', price: 1100, image: 'https://i.pinimg.com/736x/d2/4d/e8/d24de8fb2b9ff996ad43339593cf1770.jpg', description: 'Decorative wall plate hand-painted in Pattachitra style.', units: [{ label: '1 Piece', price: 1100, mrp: 1200 }] },
    { id: 129, name: 'Cane Laundry Basket', category: 'Home Decor', brand: 'Eco Living', price: 850, image: 'https://i.pinimg.com/736x/23/5d/6e/235d6eb2588842a751d4eff3acdaab11.jpg', description: 'Handwoven cane laundry basket, eco-friendly.', units: [{ label: '1 Piece', price: 850, mrp: 950 }] },
    { id: 130, name: 'Embroidered Table Runner', category: 'Home Decor', brand: 'Ethnic Threads', price: 700, image: 'https://i.pinimg.com/736x/4d/40/a8/4d40a8a0bfd92a1c71ccc31f2a8a6a9d.jpg', description: 'Cotton table runner with traditional embroidery.', units: [{ label: '1 Piece', price: 700, mrp: 750 }] },
    { id: 131, name: 'Clay Wind Chime', category: 'Home Decor', brand: 'Pottery Creations', price: 350, image: 'https://i.pinimg.com/736x/0e/8d/2f/0e8d2f141642995dbcd7946c45430cea.jpg', description: 'Handmade clay wind chime with soothing sound.', units: [{ label: '1 Piece', price: 350, mrp: 380 }] },
  ],
  'Puja Items': [
    // Added category and brand, ensured units/price structure
    { id: 201, name: 'Brass Puja Thali Set', category: 'Puja Items', brand: 'Divine Decor', price: 1200, image: 'https://i.pinimg.com/736x/6d/c0/e4/6dc0e45fc238654597b8e8018e665941.jpg', description: 'Complete brass puja thali set for rituals.', units: [{ label: '1 Set', price: 1200, mrp: 1300 }] },
    { id: 202, name: 'Clay Diya Set (Set of 12)', category: 'Puja Items', brand: 'Earthen Lights', price: 250, image: 'https://i.pinimg.com/736x/1f/a8/be/1fa8bee067f3881e4b8ae737fe5cb3c6.jpg', description: 'Set of 12 traditional clay diyas for festivals.', units: [{ label: 'Set of 12', price: 250, mrp: 270 }] },
    { id: 203, name: 'Sandalwood Incense Sticks', category: 'Puja Items', brand: 'Sacred Scents', price: 150, image: 'https://i.pinimg.com/736x/f4/29/d9/f429d9ded52f582b3b1f0d36502ac3b9.jpg', description: 'Aromatic sandalwood incense sticks for puja.', units: [{ label: '1 Pack', price: 150, mrp: 160 }] },
    { id: 204, name: 'Copper Lota (Kalash)', category: 'Puja Items', brand: 'Divine Decor', price: 450, image: 'https://i.pinimg.com/736x/4f/57/bf/4f57bfac99fc3405d4c984bc03aedf74.jpg', description: 'Pure copper lota for holding holy water.', units: [{ label: '1 Piece', price: 450, mrp: 480 }] },
    { id: 205, name: 'Ganesha Idol (Brass)', category: 'Puja Items', brand: 'Divine Decor', price: 4050, image: 'https://i.pinimg.com/736x/70/b0/23/70b023c557522db87e5dc9a389e5c635.jpg', description: 'Small brass idol of Lord Ganesha.', units: [{ label: '1 Piece', price: 950, mrp: 1050 }] },
    { id: 206, name: 'Camphor (Kapoor) Tablets', category: 'Puja Items', brand: 'Sacred Scents', price: 100, image: 'https://i.pinimg.com/736x/fd/99/6d/fd996dc3e3e7af5b53a28d25ef351723.jpg', description: 'Pure camphor tablets for aarti.', units: [{ label: '1 Pack', price: 100, mrp: 110 }] },
    { id: 207, name: 'Panchmukhi Rudraksha Mala', category: 'Puja Items', brand: 'Sacred Beads', price: 700, image: 'https://i.pinimg.com/736x/8d/e4/09/8de4093d66444746e1f55cd7a2c23146.jpg', description: 'Authentic 5-faced Rudraksha mala for Japa.', units: [{ label: '1 Mala', price: 700, mrp: 750 }] },
    { id: 208, name: 'Cotton Pooja Aasan', category: 'Puja Items', brand: 'Divine Decor', price: 300, image: 'https://via.placeholder.com/aasan.jpg', description: 'Cotton mat for sitting during puja.', units: [{ label: '1 Piece', price: 300, mrp: 320 }] },
  ],
  'Regional Snacks': [
    // Added category and brand, ensured units/price structure
    { id: 301, name: 'Bikaneri Bhujia', category: 'Regional Snacks', brand: 'Bikaji', price: 180, image: 'https://i.pinimg.com/736x/c6/d8/ee/c6d8eea0e92ab7cd0cf1375178d83e6f.jpg', description: 'Crispy and spicy snack from Bikaner.', units: [{ label: '400g Pack', price: 180, mrp: 190 }] },
    { id: 302, name: 'Kerala Banana Chips', category: 'Regional Snacks', brand: 'Malabar Crisps', price: 120, image: 'https://i.pinimg.com/736x/35/3e/18/353e1882b1395a92709842630e02fbf4.jpg', description: 'Thin and crispy banana chips fried in coconut oil.', units: [{ label: '200g Pack', price: 120, mrp: 130 }] },
    { id: 303, name: 'Gujarati Khakhra', category: 'Regional Snacks', brand: 'Gujju Bites', price: 150, image: 'https://i.pinimg.com/736x/66/70/17/6670170ffca5889d2b33a58926dea09c.jpg', description: 'Roasted thin crackers, a popular Gujarati snack.', units: [{ label: '250g Pack', price: 150, mrp: 160 }] },
    { id: 304, name: 'Maharashtrian Chakli', category: 'Regional Snacks', brand: 'Marathi Munchies', price: 160, image: 'https://i.pinimg.com/736x/90/64/f4/9064f4fccd1d40fbd35f7e4667a87b75.jpg', description: 'Spiral-shaped savory fried snack.', units: [{ label: '200g Pack', price: 160, mrp: 170 }] },
    { id: 305, name: 'Mysore Pak Sweet', category: 'Regional Snacks', brand: 'Karnataka Sweets', price: 250, image: 'https://i.pinimg.com/736x/35/bd/08/35bd088c3fd9de18c5222b512cb14e69.jpg', description: 'Rich ghee-based sweet from Mysore.', units: [{ label: '250g Box', price: 250, mrp: 270 }] },
    { id: 306, name: 'Andhra Murukku', category: 'Regional Snacks', brand: 'Telugu Tastes', price: 140, image: 'https://i.pinimg.com/736x/09/25/5e/09255e8c93ad303896f61bc5a6aa4275.jpg', description: 'Crunchy rice flour snack from Andhra Pradesh.', units: [{ label: '200g Pack', price: 140, mrp: 150 }] },
    
    { id: 308, name: 'Goan Bebinca Cake', category: 'Regional Snacks', brand: 'Goa Delights', price: 350, image: 'https://i.pinimg.com/736x/14/02/53/14025395a9c19217b43d0bcb8435a4f7.jpg', description: 'Traditional layered Goan dessert.', units: [{ label: '200g Slice', price: 350, mrp: 375 }] },
  ],
  'Pottery & Ceramics': [
    // Added category and brand, ensured units/price structure
    { id: 401, name: 'Jaipur Blue Pottery Plate', category: 'Pottery & Ceramics', brand: 'Jaipur Pottery', price: 900, image: 'https://i.pinimg.com/736x/da/38/7a/da387a8f5e2c227e8ee8e3ebd22bc175.jpg', description: 'Decorative plate in traditional Jaipur blue pottery style.', units: [{ label: '1 Plate', price: 900, mrp: 950 }] },
    { id: 402, name: 'Terracotta Water Jug', category: 'Pottery & Ceramics', brand: 'Earthen Wares', price: 350, image: 'https://i.pinimg.com/736x/d3/38/2a/d3382af5b74fcfba78239c25630a0eab.jpg', description: 'Natural clay jug for cooling water.', units: [{ label: '1 Jug', price: 350, mrp: 380 }] },
    { id: 403, name: 'Khurja Ceramic Mugs (Set of 2)', category: 'Pottery & Ceramics', brand: 'Khurja Kilns', price: 450, image: 'https://i.pinimg.com/736x/3f/4f/6b/3f4f6b786c8605bb344743e336ba79bb.jpg', description: 'Hand-painted ceramic mugs from Khurja.', units: [{ label: 'Set of 2', price: 450, mrp: 480 }] },
    { id: 404, name: 'Longpi Black Pottery Bowl', category: 'Pottery & Ceramics', brand: 'Manipur Crafts', price: 700, image: 'https://i.pinimg.com/736x/01/5c/f3/015cf314a9117e831ec5ac09c8514e87.jpg', description: 'Unique black pottery bowl from Longpi, Manipur.', units: [{ label: '1 Bowl', price: 700, mrp: 750 }] },
    { id: 405, name: 'Clay Planter Pot', category: 'Pottery & Ceramics', brand: 'Garden Greens', price: 200, image: 'https://i.pinimg.com/736x/2c/b6/03/2cb603abc701f0e2d40a7b355781acf0.jpg', description: 'Simple terracotta pot for plants.', units: [{ label: '1 Pot', price: 200, mrp: 220 }] },
    { id: 406, name: 'Ceramic Pickle Jar (Barnie)', category: 'Pottery & Ceramics', brand: 'Kitchen Classics', price: 380, image: 'https://i.pinimg.com/736x/84/47/08/8447089035154ec5ff6b174c7e27344a.jpg', description: 'Traditional ceramic jar for storing pickles.', units: [{ label: '1 Jar', price: 380, mrp: 400 }] },
    { id: 407, name: 'Hand-painted Ceramic Tiles', category: 'Pottery & Ceramics', brand: 'Decor Tiles', price: 150, image: 'https://i.pinimg.com/736x/94/ac/b4/94acb4d737fe39d61652a19a7fca3363.jpg', description: 'Decorative ceramic tile, hand-painted.', units: [{ label: '1 Tile', price: 150, mrp: 160 }] },
    { id: 408, name: 'Studio Pottery Dinner Plate', category: 'Pottery & Ceramics', brand: 'Artisan Tableware', price: 600, image: 'https://i.pinimg.com/736x/3f/af/0c/3faf0c145a82524204f5dc1705de3c3b.jpg', description: 'Handcrafted studio pottery dinner plate.', units: [{ label: '1 Plate', price: 600, mrp: 650 }] },
  ],
  'Wooden Crafts': [
    // Added category and brand, ensured units/price structure
    { id: 501, name: 'Sandalwood Elephant Figurine', category: 'Wooden Crafts', brand: 'Mysore Woods', price: 1200, image: 'https://i.pinimg.com/736x/47/36/25/473625eeb890a0e08459b9c1d841fe2d.jpg', description: 'Intricately carved sandalwood elephant.', units: [{ label: '1 Figurine', price: 1200, mrp: 1300 }] },
    { id: 502, name: 'Rosewood Jewelry Box', category: 'Wooden Crafts', brand: 'Karnataka Woods', price: 850, image: 'https://i.pinimg.com/736x/cf/b8/ec/cfb8ec4ebc8fd64e805fe8f4bfc7346e.jpg', description: 'Polished rosewood box for storing jewelry.', units: [{ label: '1 Box', price: 850, mrp: 900 }] },
    { id: 503, name: 'Channapatna Wooden Toys Set', category: 'Wooden Crafts', brand: 'Channapatna Toys', price: 600, image: 'https://i.pinimg.com/474x/e3/39/d0/e339d0e394f0c35f6f1123f52205332a.jpg', description: 'Set of traditional lacquered wooden toys.', units: [{ label: '1 Set', price: 600, mrp: 650 }] },
    { id: 504, name: 'Carved Wooden Bowl', category: 'Wooden Crafts', brand: 'Himalayan Crafts', price: 450, image: 'https://i.pinimg.com/736x/52/4a/39/524a39aceeeab3c08a23bea79ed83cad.jpg', description: 'Hand-carved decorative wooden bowl.', units: [{ label: '1 Bowl', price: 450, mrp: 480 }] },
    { id: 505, name: 'Wooden Spice Box (Masala Dabba)', category: 'Wooden Crafts', brand: 'Kitchen Woods', price: 750, image: 'https://i.pinimg.com/736x/ce/f5/44/cef544dc6561344eb79aaaf9637576b3.jpg', description: 'Traditional wooden box for storing spices.', units: [{ label: '1 Box', price: 750, mrp: 800 }] },
    { id: 506, name: 'Hand-painted Wooden Coasters', category: 'Wooden Crafts', brand: 'Artisan Woods', price: 300, image: 'https://i.pinimg.com/736x/40/8c/31/408c31feb4610190a63fa105f0adf2fc.jpg', description: 'Set of wooden coasters with hand-painted designs.', units: [{ label: 'Set of 4', price: 300, mrp: 320 }] },
    { id: 507, name: 'Wooden Wall Clock', category: 'Wooden Crafts', brand: 'Time Woods', price: 950, image: 'https://i.pinimg.com/736x/c4/21/4f/c4214f2d2cea07cd597b1125caa84c13.jpg', description: 'Stylish wall clock made from wood.', units: [{ label: '1 Clock', price: 950, mrp: 1000 }] },
    { id: 508, name: 'Teak Wood Cutting Board', category: 'Wooden Crafts', brand: 'Kitchen Woods', price: 550, image: 'https://i.pinimg.com/736x/45/44/43/454443bfe80e50e695b9f434f843a032.jpg', description: 'Durable cutting board made from teak wood.', units: [{ label: '1 Board', price: 550, mrp: 600 }] },
  ],
  'Local Food Produce': [
    // Added category and brand, ensured units/price structure
    { id: 601, name: 'Alphonso Mangoes (Seasonal)', category: 'Local Food Produce', brand: 'Ratnagiri Farms', price: 800, image: 'https://i.pinimg.com/736x/df/44/2c/df442c2e6c34ff5848cb6c1ce51bb845.jpg', description: 'Sweet and pulpy Alphonso mangoes (price per dozen approx).', units: [{ label: '1 Dozen', price: 800, mrp: 850 }] },
    { id: 602, name: 'Assam Orthodox Tea', category: 'Local Food Produce', brand: 'Assam Gardens', price: 450, image: 'https://i.pinimg.com/736x/7b/9b/2a/7b9b2ac136217047c3f3b914656ec497.jpg', description: 'Full-bodied black tea from Assam (price per 250g).', units: [{ label: '250g', price: 450, mrp: 480 }] },
    { id: 603, name: 'Araku Valley Coffee Beans', category: 'Local Food Produce', brand: 'Araku Coffee', price: 550, image: 'https://i.pinimg.com/736x/24/d8/17/24d8174133ca0fc8cf9ae54e1e533a4a.jpg', description: 'Aromatic Arabica coffee beans from Araku Valley (price per 250g).', units: [{ label: '250g', price: 550, mrp: 580 }] },
    { id: 604, name: 'Organic Jaggery Powder', category: 'Local Food Produce', brand: 'Farm Fresh', price: 180, image: 'https://i.pinimg.com/736x/84/56/89/8456898ff69b2d545fe1a70e1c407de3.jpg', description: 'Unrefined organic jaggery powder (price per 500g).', units: [{ label: '500g', price: 180, mrp: 190 }] },
    { id: 605, name: 'Himalayan Pink Salt', category: 'Local Food Produce', brand: 'Himalayan Harvest', price: 120, image: 'https://i.pinimg.com/736x/d9/5a/95/d95a95abf1956cba7253eb20a3bcf49f.jpg', description: 'Natural pink salt crystals (price per 500g).', units: [{ label: '500g', price: 120, mrp: 130 }] },
    { id: 606, name: 'Wild Forest Honey', category: 'Local Food Produce', brand: 'Forest Nectar', price: 600, image: 'https://i.pinimg.com/736x/52/08/de/5208de1ea2750b68e622397fecbd437e.jpg', description: 'Raw honey collected from wild forests (price per 500g).', units: [{ label: '500g', price: 600, mrp: 650 }] },
    { id: 607, name: 'Cold Pressed Coconut Oil', category: 'Local Food Produce', brand: 'Kerala Naturals', price: 350, image: 'https://i.pinimg.com/736x/4d/ae/9d/4dae9de3f44d4ca5d0aefd8f6ee845ab.jpg', description: 'Virgin cold-pressed coconut oil (price per 500ml).', units: [{ label: '500ml', price: 350, mrp: 375 }] },
    { id: 608, name: 'Fox Nuts (Makhana)', category: 'Local Food Produce', brand: 'Healthy Bites', price: 280, image: 'https://i.pinimg.com/736x/83/7a/d7/837ad7a61b8cfa9cf6290aac84a26280.jpg', description: 'Puffed lotus seeds, a healthy snack (price per 250g).', units: [{ label: '250g', price: 280, mrp: 300 }] },
  ],
  'Artisan Clothing': [
    // Added category and brand, ensured units/price structure
    { id: 701, name: 'Block Printed Cotton Suit Set', category: 'Artisan Clothing', brand: 'Jaipur Prints', price: 1500, image: 'https://i.pinimg.com/736x/24/d8/c9/24d8c9576ba94731eae3a756661d5c95.jpg', description: 'Comfortable cotton kurti with hand block prints.', units: [{ label: 'Standard', price: 1500, mrp: 1600 }] },
    { id: 702, name: 'Bandhani Silk Dupatta', category: 'Artisan Clothing', brand: 'Gujarat Crafts', price: 2800, image: 'https://i.pinimg.com/736x/e3/7f/52/e37f522349b60f91eb97899ad2e760a0.jpg', description: 'Vibrant silk dupatta with traditional Bandhani tie-dye.', units: [{ label: 'Standard', price: 2800, mrp: 3000 }] },
    { id: 703, name: 'Chikankari Embroidered Kurta', category: 'Artisan Clothing', brand: 'Lucknow Looms', price: 3200, image: 'https://i.pinimg.com/736x/27/10/61/2710610fe4caf4619b26688b3cb26996.jpg', description: 'Elegant kurta featuring intricate Chikankari embroidery.', units: [{ label: 'Standard', price: 3200, mrp: 3400 }] },
    { id: 704, name: 'Ajrakh Print Cotton Shirt', category: 'Artisan Clothing', brand: 'Kutch Creations', price: 1800, image: 'https://i.pinimg.com/736x/63/e7/ea/63e7ea1446e35c16e92ca14905605e6c.jpg', description: 'Men\'s cotton shirt with traditional Ajrakh block print.', units: [{ label: 'Standard', price: 1800, mrp: 1950 }] },
    { id: 705, name: 'Kalamkari Print Palazzo Pants', category: 'Artisan Clothing', brand: 'Andhra Arts', price: 1200, image: 'https://i.pinimg.com/736x/e9/d9/ee/e9d9ee4f6eb599fd54b41381ca2cae5d.jpg', description: 'Comfortable palazzo pants with Kalamkari hand-painted/block print.', units: [{ label: 'Standard', price: 1200, mrp: 1300 }] },
    { id: 706, name: 'Mirror Work Embroidered Skirt', category: 'Artisan Clothing', brand: 'Rajasthan Styles', price: 2500, image: 'https://i.pinimg.com/736x/9e/52/d0/9e52d01ac0a36353071c225d43904855.jpg', description: 'Colorful skirt adorned with traditional mirror work embroidery.', units: [{ label: 'Standard', price: 2500, mrp: 2700 }] },
    { id: 707, name: 'Kantha Stitch Silk Scarf', category: 'Artisan Clothing', brand: 'Bengal Weaves', price: 1900, image: 'https://i.pinimg.com/736x/7a/5c/bb/7a5cbbcc8edf97a3a25613f79d249a25.jpg', description: 'Silk scarf decorated with Kantha stitch embroidery.', units: [{ label: 'Standard', price: 1900, mrp: 2050 }] },
    { id: 708, name: 'Indigo Dyed Cotton Kurta', category: 'Artisan Clothing', brand: 'Natural Dyes', price: 1600, image: 'https://i.pinimg.com/736x/f0/a8/2a/f0a82a2a9138dda8c2bf0a32cd3c49a1.jpg', description: 'Stylish tunic made from naturally indigo-dyed cotton.', units: [{ label: 'Standard', price: 1600, mrp: 1750 }] },
  ],
  'Baked Goods': [
    // Added category and brand, ensured units/price structure
    { id: 801, name: 'Ragi Cookies (Finger Millet)', category: 'Baked Goods', brand: 'Healthy Bakes', price: 200, image: 'https://i.pinimg.com/736x/b4/e2/43/b4e243c5226cb64c85af4c9b356212aa.jpg', description: 'Nutritious cookies made with ragi flour (price per pack).', units: [{ label: '200g Pack', price: 200, mrp: 210 }] },
    { id: 802, name: 'Nankhatai Biscuits', category: 'Baked Goods', brand: 'Classic Bakes', price: 180, image: 'https://i.pinimg.com/736x/4d/9f/94/4d9f94bec45b168d977209f47a0f3c5c.jpg', description: 'Traditional Indian shortbread biscuits (price per pack).', units: [{ label: '250g Pack', price: 180, mrp: 190 }] },
    { id: 803, name: 'Shrewsbury Biscuits (Pune)', category: 'Baked Goods', brand: 'Kayani Bakery', price: 250, image: 'https://i.pinimg.com/736x/dd/82/5a/dd825ab265d7ea31bf4f8b39452fff5b.jpg', description: 'Famous buttery biscuits from Pune (price per pack).', units: [{ label: '200g Pack', price: 250, mrp: 265 }] },
    { id: 804, name: 'Whole Wheat Bread Loaf', category: 'Baked Goods', brand: 'Artisan Breads', price: 150, image: 'https://i.pinimg.com/736x/3a/23/26/3a232617903e3db73b23198ffeca74e8.jpg', description: 'Freshly baked whole wheat bread loaf.', units: [{ label: '1 Loaf', price: 150, mrp: 160 }] },
    { id: 805, name: 'Mawa Cake (Parsi Style)', category: 'Baked Goods', brand: 'Parsi Delights', price: 300, image: 'https://i.pinimg.com/736x/82/f2/e2/82f2e2c40b31c315b80b7fe0b094d58e.jpg', description: 'Rich milk-based cake, a Parsi specialty (price per piece/small cake).', units: [{ label: '250g Cake', price: 300, mrp: 320 }] },
    { id: 806, name: 'Coconut Macaroons', category: 'Baked Goods', brand: 'Coastal Bakes', price: 220, image: 'https://i.pinimg.com/736x/f1/9c/a7/f19ca792d3c6ce4c0217ac762ba3d9f6.jpg', description: 'Chewy coconut macaroons (price per pack).', units: [{ label: '150g Pack', price: 220, mrp: 235 }] },
    { id: 807, name: 'Osmania Biscuits (Hyderabad)', category: 'Baked Goods', brand: 'Hyderabad Bakes', price: 160, image: 'https://i.pinimg.com/736x/a8/20/d9/a820d9eac27bcd135898e421cb2ef728.jpg', description: 'Slightly sweet and salty tea biscuits (price per pack).', units: [{ label: '250g Pack', price: 160, mrp: 170 }] },
    { id: 808, name: 'Fruit Cake Slice', category: 'Baked Goods', brand: 'Festive Bakes', price: 200, image: 'https://i.pinimg.com/736x/3d/9a/52/3d9a528e282ca00642971b4b3cfd4ea8.jpg', description: 'Classic fruit cake slice with dried fruits.', units: [{ label: '10 Slice', price: 200, mrp: 110 }] },
  ],
};

// Function to get product by ID - needed by ProductDetailPage
export const getProductById = (productId) => {
  const idToFind = parseInt(productId, 10); // Ensure productId is a number
  for (const category in dummyProducts) {
    const product = dummyProducts[category].find(p => p.id === idToFind);
    if (product) {
      // Return a copy of the product object with the category added
      return { ...product, category: category };
    }
  }
  return null; // Return null if not found
};

function ProductListPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const products = dummyProducts[categoryName] || []; // Get products for the category

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`); // Navigate to the product detail page
  };

  return (
    <section className="min-h-screen py-20 bg-[#f3eee5] relative overflow-hidden pt-24"> {/* Added pt-24 */}
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        {/* Header with Back Button and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-10"
        >
          <button
            onClick={() => navigate('/categories')} // Navigate back to the categories page
            className="p-3 rounded-full hover:bg-[#e2dac9] transition-colors mr-4"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-[#251c1a] text-xl" />
          </button>
          <h1 className="text-4xl font-bold text-[#251c1a]">{categoryName}</h1>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col" // Added flex flex-col
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover" // Fixed height for images
                />
                <div className="p-4 flex flex-col flex-grow"> {/* Added flex-grow */}
                  <h3 className="text-lg font-semibold text-[#251c1a] mb-2 flex-grow">{product.name}</h3> {/* Added flex-grow */}
                  <p className="text-xl font-bold text-[#d97706] mb-4">₹{product.price}</p>
                  <button
                    className="mt-auto w-full border border-[#d97706] text-[#d97706] py-2 px-4 rounded-md hover:bg-[#fffaf0] transition-colors flex items-center justify-center space-x-2" // Added mt-auto
                    onClick={() => handleViewProduct(product.id)} // Updated onClick handler
                  >
                    <span>View Product</span>
                    <FaExternalLinkAlt size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-[#251c1a]/70">No products found in this category yet.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default ProductListPage;
