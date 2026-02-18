const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/userModel');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const DB = process.env.DATABASE;

mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful!'));

const createAdmin = async () => {
    const email = 'admin@voyana.in';
    const password = 'HelloVoyana@#$152';
    const name = 'Voyana Admin';

    try {
        let user = await User.findOne({ email });

        if (user) {
            console.log('User exists. Updating role and password...');
            user.role = 'admin';
            user.password = password;
            user.passwordConfirm = password;
            user.active = true;
            user.isVerified = true;
            await user.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            user = await User.create({
                name,
                email,
                password,
                passwordConfirm: password,
                role: 'admin',
                active: true,
                isVerified: true
            });
            console.log('Admin user created successfully.');
        }
    } catch (err) {
        console.error('Error creating admin:', err);
    }
    process.exit();
};

createAdmin();
