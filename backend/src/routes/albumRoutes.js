import express from "express";

import {
  crearAlbum,
  obtenerAlbumesPendientes,
  aprobarAlbum,
  obtenerAlbumesPublicos,
  obtenerMisAlbumes,
  obtenerAlbumesAdmin,
  cambiarPrivacidadAlbum,
  eliminarAlbumAdmin
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
  "/admin/todos",
  verificarToken,
  verificarAdmin,
  obtenerAlbumesAdmin
);

router.get(
  "/mis-albumes",
  verificarToken,
  obtenerMisAlbumes
);

router.put(
  "/admin/privacidad/:id",
  verificarToken,
  verificarAdmin,
  cambiarPrivacidadAlbum
);

router.delete(
  "/admin/eliminar/:id",
  verificarToken,
  verificarAdmin,
  eliminarAlbumAdmin
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