import express from "express";

import {
  generar2FA,
  activar2FA
} from "../controllers/twofaController.js";

import {
  verificarToken
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/generar", verificarToken, generar2FA);
router.post("/activar", verificarToken, activar2FA);

export default router;