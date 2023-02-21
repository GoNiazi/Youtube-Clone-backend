import express from "express";
import { signin, signup, google } from "../controllers/auth.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", signup);

//SIGN IN
router.post("/signin", signin);

//GOOGLE AUTH
router.post("/google", google);

export default router;
