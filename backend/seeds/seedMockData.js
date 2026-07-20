require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Gallery = require('../models/GalleryImage');

// Also try loading .env from the current directory if run from inside backend
require('dotenv').config();

const servicesData = [
  {
    name: 'Premium Banquet Halls',
    category: 'Venue',
    duration: 'Full Day',
    price: 150000,
    tag: 'Popular',
    imageUrl: '/images/placeholder_venue_banquet.jpg',
    description: "Luxurious, climate-controlled halls perfect for grand receptions and indoor ceremonies.",
  },
  {
    name: 'Destination Resorts',
    category: 'Venue',
    duration: 'Multi-Day',
    price: 350000,
    tag: 'Trending',
    imageUrl: '/images/placeholder_venue_resort.jpg',
    description: "Beachside properties and heritage estates for an unforgettable destination wedding experience.",
  },
  {
    name: 'Open Air Lawns & Farmhouses',
    category: 'Venue',
    duration: 'Evening',
    price: 100000,
    tag: '',
    imageUrl: '/images/placeholder_venue_lawns.jpg',
    description: "Spacious, lush green landscapes ideal for winter weddings and evening pheras under the stars.",
  },
  {
    name: 'Luxury Beachfront Venues',
    category: 'Venue',
    duration: 'Multi-Day',
    price: 500000,
    tag: 'Premium',
    imageUrl: '/images/wedding_venue.png',
    description: "Exclusive beachfront venues for a serene and picturesque wedding ceremony by the ocean.",
  },
  {
    name: 'Cinematic Wedding Photographers',
    category: 'Photography',
    duration: 'Event Based',
    price: 80000,
    tag: 'Bestseller',
    imageUrl: '/images/placeholder_photo_wedding.jpg',
    description: "Candid moments, drone videography, and stunning cinematic films to capture your forever memories.",
  },
  {
    name: 'Pre-Wedding Shoots',
    category: 'Photography',
    duration: 'Full Day',
    price: 25000,
    tag: '',
    imageUrl: '/images/placeholder_photo_prewedding.jpg',
    description: "Conceptual photoshoots at picturesque locations to tell your unique love story before the big day.",
  },
  {
    name: 'Premium Photography Package',
    category: 'Photography',
    duration: 'End-to-End',
    price: 150000,
    tag: 'Premium',
    imageUrl: '/images/wedding_photography.png',
    description: "Comprehensive photography coverage including pre-wedding, candid, traditional, and cinematic video.",
  },
  {
    name: 'Celebrity Makeup Artists',
    category: 'Makeup',
    duration: 'Per Session',
    price: 35000,
    tag: 'Premium',
    imageUrl: '/images/placeholder_makeup_bridal.jpg',
    description: "Airbrush and HD makeup by industry experts for a flawless, long-lasting bridal glow.",
  },
  {
    name: 'Family Makeup Packages',
    category: 'Makeup',
    duration: 'Per Session',
    price: 15000,
    tag: '',
    imageUrl: '/images/placeholder_makeup_family.jpg',
    description: "Professional makeup and hair styling for bridesmaids, mothers, and close relatives.",
  },
  {
    name: 'Bridal Styling & Artistry',
    category: 'Makeup',
    duration: 'Full Day',
    price: 50000,
    tag: 'Exclusive',
    imageUrl: '/images/wedding_makeup.png',
    description: "Complete bridal styling including makeup, hair, and draping with high-end international products.",
  },
  {
    name: 'Complete Event Planning',
    category: 'Planning & Decor',
    duration: 'End-to-End',
    price: 200000,
    tag: 'Popular',
    imageUrl: '/images/placeholder_planning_full.jpg',
    description: "From venue selection to logistics, we handle every detail so you can enjoy your wedding stress-free.",
  },
  {
    name: 'Thematic Decor & Florals',
    category: 'Planning & Decor',
    duration: 'Per Event',
    price: 120000,
    tag: '',
    imageUrl: '/images/placeholder_decor_floral.jpg',
    description: "Customized themes, exotic floral arrangements, and elegant lighting setups to transform your venue.",
  },
  {
    name: 'Royal Mandap & Stage Decor',
    category: 'Planning & Decor',
    duration: 'Per Event',
    price: 180000,
    tag: 'Trending',
    imageUrl: '/images/wedding_decor.png',
    description: "Breathtaking royal mandap setups and grand stage decorations tailored to your specific theme.",
  },
  {
    name: 'Designer Bridal Lehengas',
    category: 'Bridal Wear',
    duration: 'Purchase/Rental',
    price: 75000,
    tag: 'Exclusive',
    imageUrl: '/images/placeholder_wear_lehenga.jpg',
    description: "Handcrafted, intricate designer lehengas and sarees available for purchase or premium rental.",
  },
  {
    name: 'Classic Silk Sarees',
    category: 'Bridal Wear',
    duration: 'Purchase',
    price: 45000,
    tag: '',
    imageUrl: '/images/placeholder_wear_saree.jpg',
    description: "Authentic, pure silk sarees sourced from top weavers for traditional ceremonies.",
  },
  {
    name: 'Groom Sherwanis & Suits',
    category: 'Groom Wear',
    duration: 'Purchase/Rental',
    price: 45000,
    tag: '',
    imageUrl: '/images/placeholder_wear_sherwani.jpg',
    description: "Bespoke tailoring, royal sherwanis, and modern tuxedos for the perfect groom look.",
  },
  {
    name: 'Bespoke Groom Suits',
    category: 'Groom Wear',
    duration: 'Purchase',
    price: 55000,
    tag: 'Premium',
    imageUrl: '/images/placeholder_wear_suits.jpg',
    description: "Custom-fitted, high-quality bespoke suits and tuxedos for the modern groom.",
  },
  {
    name: 'Bridal Mehendi Artists',
    category: 'Mehendi',
    duration: 'Per Session',
    price: 11000,
    tag: '',
    imageUrl: '/images/placeholder_mehendi_art.jpg',
    description: "Intricate, customized bridal henna designs featuring portraits and traditional motifs.",
  },
  {
    name: 'Premium Mehendi Packages',
    category: 'Mehendi',
    duration: 'Full Day',
    price: 25000,
    tag: 'Popular',
    imageUrl: '/images/wedding_mehendi.png',
    description: "Extensive mehendi application for the bride and all guests by a team of skilled artists.",
  },
  {
    name: 'Fine Jewellery Collections',
    category: 'Jewellery',
    duration: 'Purchase/Rental',
    price: 50000,
    tag: 'Premium',
    imageUrl: '/images/placeholder_jewel_bridal.jpg',
    description: "Exquisite Kundan, Polki, and diamond jewellery sets to complement your wedding attire.",
  },
  {
    name: 'Digital & Physical Invites',
    category: 'Invites & Gifts',
    duration: 'Per Order',
    price: 15000,
    tag: '',
    imageUrl: '/images/placeholder_invites_digital.jpg',
    description: "Custom animated video invites, luxurious physical cards, and personalized return gifts.",
  },
  {
    name: 'Sangeet Choreography',
    category: 'Music & Dance',
    duration: 'Package',
    price: 20000,
    tag: 'Popular',
    imageUrl: '/images/placeholder_music_choreo.jpg',
    description: "Professional choreographers to prepare the couple and family for an unforgettable Sangeet performance.",
  },
  {
    name: 'Live Bands & DJs',
    category: 'Music & Dance',
    duration: 'Per Event',
    price: 30000,
    tag: '',
    imageUrl: '/images/placeholder_music_dj.jpg',
    description: "Energetic live bands, classical musicians for pheras, and top DJs for the reception party.",
  },
  {
    name: 'Complete Entertainment Package',
    category: 'Music & Dance',
    duration: 'Multi-Day',
    price: 80000,
    tag: 'Premium',
    imageUrl: '/images/wedding_entertainment.png',
    description: "A complete entertainment solution covering Sangeet choreography, live musicians, and top-tier DJs.",
  },
  {
    name: 'Gourmet Catering Services',
    category: 'Food',
    duration: 'Per Plate',
    price: 1500,
    tag: 'Essential',
    imageUrl: '/images/placeholder_food_gourmet.jpg',
    description: "Multi-cuisine buffet setups, live counters, and exquisite desserts crafted by master chefs.",
  },
  {
    name: 'Artisan Wedding Cakes',
    category: 'Food',
    duration: 'Per Order',
    price: 25000,
    tag: 'Exclusive',
    imageUrl: '/images/placeholder_food_cakes.jpg',
    description: "Custom-designed, multi-tier wedding cakes that taste as stunning as they look.",
  },
  {
    name: 'Luxury Dining Experience',
    category: 'Food',
    duration: 'Per Plate',
    price: 3500,
    tag: 'Premium',
    imageUrl: '/images/wedding_catering.png',
    description: "A curated luxury dining experience with personalized menus and fine-dining service.",
  }
];

const galleryData = [
  { category: 'Venue', title: 'Royal Palace Banquet', imageUrl: '/images/placeholder_venue_banquet.jpg' },
  { category: 'Food', title: 'Fusion Dessert Counter', imageUrl: '/images/placeholder_food_gourmet.jpg' },
  { category: 'Planning & Decor', title: 'Sunset Floral Mandap', imageUrl: '/images/placeholder_decor_floral.jpg' },
  { category: 'Bridal Wear', title: 'Traditional Bridal Lehenga', imageUrl: '/images/placeholder_wear_lehenga.jpg' },
  { category: 'Venue', title: 'Heritage Resort Lawn', imageUrl: '/images/placeholder_venue_lawns.jpg' },
  { category: 'Planning & Decor', title: 'Golden Canopy Lighting', imageUrl: '/images/placeholder_decor_floral.jpg' },
  { category: 'Photography', title: 'Cinematic Couple Portrait', imageUrl: '/images/placeholder_photo_wedding.jpg' },
  { category: 'Makeup', title: 'Flawless Bridal Makeup', imageUrl: '/images/placeholder_makeup_bridal.jpg' },
  { category: 'Groom Wear', title: 'Royal Sherwani', imageUrl: '/images/placeholder_wear_sherwani.jpg' },
  { category: 'Mehendi', title: 'Intricate Bridal Mehendi', imageUrl: '/images/placeholder_mehendi_art.jpg' },
  { category: 'Jewellery', title: 'Polki & Kundan Sets', imageUrl: '/images/placeholder_jewel_bridal.jpg' },
  { category: 'Invites & Gifts', title: 'Wax Seal Digital Invites', imageUrl: '/images/placeholder_invites_digital.jpg' },
  { category: 'Music & Dance', title: 'Sangeet Choreography', imageUrl: '/images/placeholder_music_choreo.jpg' },
  { category: 'Photography', title: 'Pre-Wedding Couple Shot', imageUrl: '/images/couple_1.png' },
  { category: 'Venue', title: 'Luxury Decor Setup', imageUrl: '/images/hero_banner.png' }
];

const seedMockData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for mock data seeding');

    // Clear existing data
    await Service.deleteMany({});
    await Gallery.deleteMany({});
    console.log('🗑️ Cleared existing services and gallery items');

    // Insert Services
    await Service.insertMany(servicesData);
    console.log(`✅ Inserted ${servicesData.length} mock services`);

    // Insert Gallery + Every image from Services that isn't already in Gallery
    const galleryItems = [...galleryData];
    
    // Track URLs to avoid duplicates
    const existingUrls = new Set(galleryData.map(item => item.imageUrl));

    for (const service of servicesData) {
      if (service.imageUrl && !existingUrls.has(service.imageUrl)) {
        galleryItems.push({
          category: service.category,
          title: service.name,
          imageUrl: service.imageUrl
        });
        existingUrls.add(service.imageUrl);
      }
    }

    await Gallery.insertMany(galleryItems);
    console.log(`✅ Inserted ${galleryItems.length} gallery images (including all service images)`);

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedMockData();
