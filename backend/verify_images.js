const fs = require('fs');
const axios = require('axios');

async function checkImages() {
    try {
        const response = await axios.get('http://localhost:5000/api/v1/tours');
        const tours = response.data.data.tours;
        console.log(`Fetched ${tours.length} tours.`);

        let brokenTours = [];
        for (const tour of tours) {
            if (!tour.imageCover.startsWith('http')) {
                brokenTours.push({ name: tour.name, image: tour.imageCover, error: 'Local path' });
                continue;
            }

            try {
                const imgRes = await axios.head(tour.imageCover);
                if (imgRes.status !== 200) {
                    brokenTours.push({ name: tour.name, image: tour.imageCover, error: `Status ${imgRes.status}` });
                }
            } catch (err) {
                brokenTours.push({ name: tour.name, image: tour.imageCover, error: err.message });
            }
        }

        fs.writeFileSync('broken_images.json', JSON.stringify(brokenTours, null, 2));
        console.log(`Found ${brokenTours.length} broken images. Saved to broken_images.json`);

    } catch (error) {
        console.error('Error fetching tours:', error.message);
    }
}

checkImages();
