const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const passport = require('passport');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/verifyOTP', authController.verifyOTP);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), authController.googleAuthCallback);

router.use(authController.protect);

router.get('/me', userController.getMe);
router.get('/stats', userController.getProfileStats);
router.post('/wishlist/:tourId', userController.toggleWishlist);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
