/* 
  HOW TO ADD NEW IMAGES (For the Client):
  1. Add your new image file to the `public/images/gallery/` folder (or just `public/images/`).
  2. Add a new row below following the exact same format.
  3. Make sure the ID is unique, category matches one of the tabs below, and the image path is correct!
*/

export const galleryData = [
  { id: 1, category: 'Venue', title: 'Royal Palace Banquet', image: '/images/wedding_venue.png' },
  { id: 2, category: 'Catering', title: 'Fusion Dessert Counter', image: '/images/wedding_catering.png' },
  { id: 3, category: 'Decor', title: 'Sunset Floral Mandap', image: '/images/wedding_decor.png' },
  { id: 4, category: 'Styling', title: 'Traditional Bridal Lehenga', image: '/images/wedding_styling.png' },
  { id: 5, category: 'Venue', title: 'Heritage Resort Lawn', image: '/images/wedding_venue.png' },
  { id: 6, category: 'Decor', title: 'Golden Canopy Lighting', image: '/images/wedding_decor.png' },
]

export const galleryCategories = ['All', 'Venue', 'Catering', 'Decor', 'Photography', 'Makeup', 'Mehendi', 'Entertainment', 'Styling']
