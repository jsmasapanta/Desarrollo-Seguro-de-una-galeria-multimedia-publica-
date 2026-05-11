import express from "express";

import {
  crearAlbum,
  obtenerAlbumesPendientes,
  aprobarAlbum,
  obtenerAlbumesPublicos
} from "../controllers/albumController.js";

import {
  verificarToken,
  verificarAdmin
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/crear",
  verificarToken,
  crearAlbum
);

router.get(
  "/pendientes",
  verificarToken,
  verificarAdmin,
  obtenerAlbumesPendientes
);

router.put(
  "/aprobar/:id",
  verificarToken,
  verificarAdmin,
  aprobarAlbum
);

router.get(
  "/publicos",
  obtenerAlbumesPublicos
);

export default router;