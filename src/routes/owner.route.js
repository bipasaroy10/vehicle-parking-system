import { loginOwner, registerOwner, AccessAllData } from "../controllers/owner.controller.js";
import { authenticateOwner } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();


router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.get("/allData", authenticateOwner, AccessAllData);



export default router;