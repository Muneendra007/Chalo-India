const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/userModel');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!'));

const makeAdmin = async () => {
    const email = process.argv[2];
    if (!email) {
        console.log('Please provide an email address: node makeAdmin.js <email>');
        process.exit(1);
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true, runValidators: false } // runValidators false to avoid password confirm checks if any
        );

        if (!user) {
            console.log('User not found!');
        } else {
            console.log(`User ${user.name} (${user.email}) is now an Admin.`);
        }
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

makeAdmin();
