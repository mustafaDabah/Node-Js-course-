const express =  require('express');
const userControllers =  require('../controllers/userControllers');
const authControllers =  require('../controllers/authControllers');

const router = express.Router();

// >>> Users
router.post('/signup' , authControllers.signup);
router.post('/login' , authControllers.login);

// >>> password
router.post('/forgotPassword' , authControllers.forgetPassword);
router.patch('/resetPassword/:token' , authControllers.resetPassword);

router.route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser)

router.route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser)  

module.exports = router  