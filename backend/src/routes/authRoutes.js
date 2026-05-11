import { loginLimiter } from "../middlewares/loginLimiter.js";


import express from "express";
import {
  registrarUsuario,
  loginUsuario
} from "../controllers/authController.js";

const router = express.Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginLimiter, loginUsuario);

export default router;