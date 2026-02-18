const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./src/models/tourModel');

dotenv.config({ path: './.env' });

const updates = [
    { name: 'Mysore Palace Tour', image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Munnar Hill Station Getaway', image: 'https://images.unsplash.com/photo-1628163618177-33230b809804?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Goa Beach Bonanza', image: 'https://images.unsplash.com/photo-1590486803274-725350488ee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Meghalaya Living Root Bridges', image: 'https://images.unsplash.com/photo-1594912957771-6c17e6514781?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Sundarbans Boat Safari', image: 'https://images.unsplash.com/photo-1586526189912-881b490f0556?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Valley of Flowers Trek', image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Bandhavgarh Tiger Trail', image: 'https://images.unsplash.com/photo-1557002668-5e8cd71b0008?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Kedarnath Trek', image: 'https://images.unsplash.com/photo-1634623789423-4217316027a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Rameswaram Temple Tour', image: 'https://images.unsplash.com/photo-1605652579192-3a3f01b1239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'Kodaikanal Lake Mist', image: 'https://images.unsplash.com/photo-1588645657803-31121d51f7bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
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
