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
    const rutaLimpia = "src/uploads/clean-" + req.file.filename;

    let analisis;

    try {
      await sharp(rutaArchivo)
        .jpeg({ quality: 100 })
        .toFile(rutaLimpia);

      analisis = await analizarImagen(rutaLimpia);
    } catch (error) {
      analisis = {
        estado: "sospechoso",
        resultado: "Archivo inválido o manipulado. No pudo ser procesado como imagen real."
      };
    }

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
      a.titulo AS album,
      u.nombre AS usuario,
      c.motivo,
      c.fecha_revision
    FROM imagenes i
    INNER JOIN cuarentena c ON i.id = c.imagen_id
    LEFT JOIN albumes a ON i.album_id = a.id
    LEFT JOIN usuarios u ON i.usuario_id = u.id
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

export const obtenerImagenesAdmin = async (req, res) => {
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
        a.titulo AS album,
        u.nombre AS usuario,
        i.fecha_subida
      FROM imagenes i
      LEFT JOIN albumes a ON i.album_id = a.id
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      ORDER BY i.fecha_subida DESC`
    );

    res.json(imagenes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener imágenes",
      error: error.message
    });
  }
};

export const eliminarImagenAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await conexion.query(
      "DELETE FROM cuarentena WHERE imagen_id = ?",
      [id]
    );

    await conexion.query(
      "DELETE FROM imagenes WHERE id = ?",
      [id]
    );

    res.json({
      mensaje: "Imagen eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar imagen",
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


export const obtenerImagenesPublicas = async (req, res) => {
  try {
    const [imagenes] = await conexion.query(
      `SELECT 
        i.id,
        i.nombre_archivo,
        i.ruta_archivo,
        i.estado,
        i.album_id,
        a.titulo AS album
      FROM imagenes i
      INNER JOIN albumes a ON i.album_id = a.id
      WHERE i.estado = 'limpio'
      AND a.estado = 'aprobado'`
    );

    res.json(imagenes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener imágenes públicas",
      error: error.message
    });
  }
};
