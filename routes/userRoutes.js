const express =  require('express');
const userControllers =  require('../controllers/userControllers');
const authControllers =  require('../controllers/authControllers');

const router = express.Router();

// >>> Users
router.post('/signup' , authControllers.signup);
router.patch('/activityAccount/:token' , authControllers.activityUser);
router.post('/login' , authControllers.login);

// >>> password
router.post('/forgotPassword' , authControllers.forgetPassword);
router.patch('/resetPassword/:token' , authControllers.resetPassword);

// >>> Update User Information
router.patch('/updateMyPassword' , authControllers.protect ,authControllers.updatePassword);
router.patch('/updateMe' , authControllers.protect, userControllers.updateMe);

// >>> Delete user 
router.delete('/deleteMe' , authControllers.protect, userControllers.deleteMe);

router.route('/')
  .get(userControllers.getAllUsers)

module.exports = router  