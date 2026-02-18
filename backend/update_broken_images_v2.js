const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./src/models/tourModel');

dotenv.config({ path: './.env' });

// Verified working URLs from existing tours
const reliableImages = {
    nature_green: 'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Kerala/Greenery
    beach: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Goa/Beach
    mountain: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Himalayas
    temple: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Ajanta/Temple
    lake: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Ooty/Lake
    desert: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Rajasthan
};

const updates = [
    { name: 'Munnar Hill Station Getaway', image: reliableImages.nature_green },
    { name: 'Goa Beach Bonanza', image: reliableImages.beach },
    { name: 'Meghalaya Living Root Bridges', image: reliableImages.lake }, // Greenery/Water
    { name: 'Sundarbans Boat Safari', image: reliableImages.nature_green }, // Greenery
    { name: 'Valley of Flowers Trek', image: reliableImages.nature_green }, // Flowers/Green
    { name: 'Bandhavgarh Tiger Trail', image: reliableImages.mountain }, // Nature/Wild
    { name: 'Kedarnath Trek', image: reliableImages.mountain }, // Mountain
    { name: 'Rameswaram Temple Tour', image: reliableImages.temple },
    { name: 'Kodaikanal Lake Mist', image: reliableImages.lake },
    { name: 'Mysore Palace Tour', image: reliableImages.temple } // Palace/Temple
];

async function updateImages() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        for (const update of updates) {
            const tour = await Tour.findOne({ name: update.name });
            if (tour) {
                tour.imageCover = update.image;
                // Update images array with the same image repeated 3 times to ensure no broken links in gallery
                tour.images = [update.image, update.image, update.image];
                await tour.save();
                console.log(`Updated images for: ${update.name}`);
            } else {
                console.log(`Tour not found: ${update.name}`);
            }
        }
        console.log('All updates complete.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateImages();
