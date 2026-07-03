/* 
  HOW TO ADD NEW IMAGES (For the Client):
  1. Add your new image file to the `public/images/gallery/` folder (or just `public/images/`).
  2. Add a new row below following the exact same format.
  3. Make sure the ID is unique, category matches one of the tabs below, and the image path is correct!
*/

export const galleryData = [
  { id: 1, category: 'Venue', title: 'Royal Palace Banquet', image: '/images/placeholder_venue_banquet.jpg' },
  { id: 2, category: 'Food', title: 'Fusion Dessert Counter', image: '/images/placeholder_food_gourmet.jpg' },
  { id: 3, category: 'Planning & Decor', title: 'Sunset Floral Mandap', image: '/images/placeholder_decor_floral.jpg' },
  { id: 4, category: 'Bridal Wear', title: 'Traditional Bridal Lehenga', image: '/images/placeholder_wear_lehenga.jpg' },
  { id: 5, category: 'Venue', title: 'Heritage Resort Lawn', image: '/images/placeholder_venue_lawns.jpg' },
  { id: 6, category: 'Planning & Decor', title: 'Golden Canopy Lighting', image: '/images/placeholder_decor_floral.jpg' },
  { id: 7, category: 'Photography', title: 'Cinematic Couple Portrait', image: '/images/placeholder_photo_wedding.jpg' },
  { id: 8, category: 'Makeup', title: 'Flawless Bridal Makeup', image: '/images/placeholder_makeup_bridal.jpg' },
  { id: 9, category: 'Groom Wear', title: 'Royal Sherwani', image: '/images/placeholder_wear_sherwani.jpg' },
  { id: 10, category: 'Mehendi', title: 'Intricate Bridal Mehendi', image: '/images/placeholder_mehendi_art.jpg' },
  { id: 11, category: 'Jewellery', title: 'Polki & Kundan Sets', image: '/images/placeholder_jewel_bridal.jpg' },
  { id: 12, category: 'Invites & Gifts', title: 'Wax Seal Digital Invites', image: '/images/placeholder_invites_digital.jpg' },
  { id: 13, category: 'Music & Dance', title: 'Sangeet Choreography', image: '/images/placeholder_music_choreo.jpg' }
]

export const galleryCategories = [
  'All', 
  'Venue', 
  'Photography', 
  'Makeup', 
  'Planning & Decor', 
  'Bridal Wear', 
  'Groom Wear', 
  'Mehendi', 
  'Jewellery', 
  'Invites & Gifts', 
  'Music & Dance', 
  'Food'
]
