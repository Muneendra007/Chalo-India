const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/userModel');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const updateAdmin = async () => {
    try {
        // Find existing admin (either by old email or just role 'admin')
        const admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            console.log('No admin found to update. Creating new one...');
            await User.create({
                name: 'Admin',
                email: 'admin@chaloindia.in',
                password: 'ChaloIndia@#$152',
                passwordConfirm: 'ChaloIndia@#$152',
                role: 'admin',
                active: true,
                isVerified: true
            });
        } else {
            console.log(`Found admin: ${admin.email}. Updating...`);
            admin.email = 'admin@chaloindia.in';
            admin.password = 'ChaloIndia@#$152';
            admin.passwordConfirm = 'ChaloIndia@#$152';
            admin.isVerified = true;
            await admin.save();
        }

        console.log('Admin credentials updated successfully!');
        process.exit();
    } catch (err) {
        console.error('Error updating admin:', err);
        process.exit(1);
    }
};

updateAdmin();
