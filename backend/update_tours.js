const fs = require('fs');
const path = require('path');

const toursPath = path.join(__dirname, 'dev-data', 'data', 'tours.json');
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf-8'));

// Reliable Unsplash Image URLs
const validImages = [
    'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Taj Mahal
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mumbai
    'https://images.unsplash.com/photo-1596392927242-16e6ca0896fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Varanasi
    'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Kerala
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Goa
    'https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Kerala Boat
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Himalayas
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Goa Beach
    'https://images.unsplash.com/photo-1582555314777-62464b54e339?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mysore
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'  // Rajasthan
];

let updatedCount = 0;
const updatedTours = tours.map((tour, index) => {
    // Cycle through valid images
    const newImage = validImages[index % validImages.length];

    // Update imageCover and images array
    tour.imageCover = newImage;
    tour.images = [newImage, validImages[(index + 1) % validImages.length], validImages[(index + 2) % validImages.length]];

    updatedCount++;
    return tour;
});

fs.writeFileSync(toursPath, JSON.stringify(updatedTours, null, 4));
console.log(`Updated ${updatedCount} tours with valid images.`);
