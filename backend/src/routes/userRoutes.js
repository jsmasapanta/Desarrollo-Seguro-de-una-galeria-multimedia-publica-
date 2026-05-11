import express from "express";

import {
  perfilUsuario,
  panelAdmin
} from "../controllers/userController.js";

import {
  verificarToken,
  verificarAdmin
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/perfil",
  verificarToken,
  perfilUsuario
);

router.get(
  "/admin",
  verificarToken,
  verificarAdmin,
  panelAdmin
);

export default router;