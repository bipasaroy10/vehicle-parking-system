import express from 'express';
import { registerAdmin, loginAdmin, getAdmin, getParkingStatus } from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/registerAd', registerAdmin);
router.post('/loginAd', loginAdmin);
router.get('/getAdmin', authenticateAdmin, getAdmin);
router.get('/parkingStatus', authenticateAdmin, getParkingStatus);


export default router;
