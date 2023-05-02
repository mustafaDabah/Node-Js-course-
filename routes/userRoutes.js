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

// >>> Protect All Routes After this middleware
router.use(authControllers.protect)

// >>> Update User Information
router.get('/me', userControllers.getMe, userControllers.getUser)
router.patch('/updateMyPassword' , authControllers.updatePassword);
router.patch('/updateMe',  userControllers.updateMe);
router.delete('/deleteMe',  userControllers.deleteMe);
 
router.use(authControllers.restrictTo('admin'));

// >>> admin
router.route('/:id')
  .get(userControllers.getUser)
  .delete(userControllers.deleteUser)
  .patch(userControllers.updateUser)

router.route('/')
  .get(userControllers.getAllUsers) 

module.exports = router  