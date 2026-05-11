import express from "express";

import {
  subirImagen,
  upload,
  obtenerCuarentena,
  aprobarImagen,
  rechazarImagen,
  obtenerImagenesPublicas
} from "../controllers/imageController.js";

import {
  verificarToken,
  verificarAdmin
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/publicas",
  obtenerImagenesPublicas
);


router.post(
  "/subir",
  verificarToken,
  upload.single("imagen"),
  subirImagen
);

router.get(
  "/cuarentena",
  verificarToken,
  verificarAdmin,
  obtenerCuarentena
);

router.put(
  "/aprobar/:id",
  verificarToken,
  verificarAdmin,
  aprobarImagen
);

router.put(
  "/rechazar/:id",
  verificarToken,
  verificarAdmin,
  rechazarImagen
);

export default router;