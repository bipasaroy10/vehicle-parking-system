import express from 'express';
import { registerUser, loginUser, getUser, getAllAdmins, bookParking } from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = express.Router();

router.post('/register', upload.fields([{ name: 'profileImage', maxCount: 1 }, {name: 'userLicense', maxCount: 1}]), registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateUser, getUser);
router.get('/admins', authenticateUser, getAllAdmins);
router.post('/bookParking/:adminId', authenticateUser, bookParking);



export default router;