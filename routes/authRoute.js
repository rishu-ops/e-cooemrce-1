import express  from 'express';
import { registerController , loginController , testController , forgotPasswordController , updateProfileController   } from '../controllers/authController.js'
import { requireSignIn , isAdmin } from '../middlewares/authMiddlewares.js';
// router object 

const router = express.Router();

router.post('/register' , registerController )
router.post('/login' , loginController);

router.post('/forget-password' , forgotPasswordController);

router.get('/test' , requireSignIn , isAdmin , testController)

router.get("/user-auth",  (req, res) => {
  res.status(200).json({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth",   (req, res) => {
  res.status(200).json({ ok: true });
});
router.put('/profile'   , updateProfileController )


export default router;

