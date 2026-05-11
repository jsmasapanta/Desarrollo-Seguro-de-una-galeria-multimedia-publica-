import multer from "multer";
import path from "path";
import conexion from "../config/db.js";
import { analizarImagen } from "../services/stegoService.js";
import sharp from "sharp";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },

  filename: (req, file, cb) => {
    const nombre =
      Date.now() + path.extname(file.originalname);

    cb(null, nombre);
  }
});

export const upload = multer({
  storage
});

export const subirImagen = async (req, res) => {
  try {
    const { album_id } = req.body;

    if (!req.file) {
      return res.status(400).json({
        mensaje: "Imagen requerida"
      });
    }

    const rutaArchivo = req.file.path;
    const rutaLimpia =
    "src/uploads/clean-" + req.file.filename;

    await sharp(rutaArchivo)
    .jpeg({ quality: 100 })
    .toFile(rutaLimpia);

    //fs.unlinkSync(rutaArchivo);

    const analisis = await analizarImagen(
       rutaLimpia
    );

    const [resultado] = await conexion.query(
      `INSERT INTO imagenes
      (nombre_archivo, ruta_archivo, estado,
      resultado_analisis, album_id, usuario_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.file.filename,
        rutaArchivo,
        analisis.estado,
        analisis.resultado,
        album_id,
        req.usuario.id
      ]
    );

    if (analisis.estado === "sospechoso") {
      await conexion.query(
        `INSERT INTO cuarentena
        (imagen_id, motivo)
        VALUES (?, ?)`,
        [
          resultado.insertId,
          analisis.resultado
        ]
      );
    }

    res.json({
      mensaje: "Imagen procesada",
      analisis
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error subiendo imagen",
      error: error.message
    });
  }
};

export const obtenerCuarentena = async (req, res) => {
  try {
    const [imagenes] = await conexion.query(
      `SELECT 
        i.id,
        i.nombre_archivo,
        i.ruta_archivo,
        i.estado,
        i.resultado_analisis,
        i.album_id,
        i.usuario_id,
        c.motivo,
        c.fecha_revision
      FROM imagenes i
      INNER JOIN cuarentena c ON i.id = c.imagen_id
      WHERE i.estado = 'sospechoso'`
    );

    res.json(imagenes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener cuarentena",
      error: error.message
    });
  }
};

export const aprobarImagen = async (req, res) => {
  try {
    const { id } = req.params;

    await conexion.query(
      "UPDATE imagenes SET estado = 'limpio' WHERE id = ?",
      [id]
    );

    await conexion.query(
      "DELETE FROM cuarentena WHERE imagen_id = ?",
      [id]
    );

    res.json({
      mensaje: "Imagen aprobada manualmente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al aprobar imagen",
      error: error.message
    });
  }
};

export const rechazarImagen = async (req, res) => {
  try {
    const { id } = req.params;

    await conexion.query(
      "UPDATE imagenes SET estado = 'rechazado' WHERE id = ?",
      [id]
    );

    await conexion.query(
      "DELETE FROM cuarentena WHERE imagen_id = ?",
      [id]
    );

    res.json({
      mensaje: "Imagen rechazada"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al rechazar imagen",
      error: error.message
    });
  }
};