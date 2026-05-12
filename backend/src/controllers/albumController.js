import conexion from "../config/db.js";

export const crearAlbum = async (req, res) => {
  try {
    const { titulo, descripcion, privacidad } = req.body;

    if (!titulo) {
      return res.status(400).json({
        mensaje: "Título requerido"
      });
    }

    await conexion.query(
      `INSERT INTO albumes 
      (titulo, descripcion, privacidad, estado, usuario_id)
      VALUES (?, ?, ?, ?, ?)`,
      [
        titulo,
        descripcion,
        privacidad || "publico",
        "pendiente",
        req.usuario.id
      ]
    );

    res.status(201).json({
      mensaje: "Álbum enviado para revisión"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear álbum",
      error: error.message
    });
  }
};

export const obtenerAlbumesPendientes = async (req, res) => {
  try {
    const [albumes] = await conexion.query(
      "SELECT * FROM albumes WHERE estado = 'pendiente'"
    );

    res.json(albumes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener álbumes"
    });
  }
};

export const aprobarAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    await conexion.query(
      "UPDATE albumes SET estado = 'aprobado' WHERE id = ?",
      [id]
    );

    res.json({
      mensaje: "Álbum aprobado"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al aprobar álbum"
    });
  }
};

export const obtenerAlbumesAdmin = async (req, res) => {
  try {
    const [albumes] = await conexion.query(
      `SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.estado,
        a.privacidad,
        u.nombre AS usuario,
        (
          SELECT COUNT(*) 
          FROM imagenes i 
          WHERE i.album_id = a.id
        ) AS total_imagenes
      FROM albumes a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.id DESC`
    );

    res.json(albumes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener álbumes",
      error: error.message
    });
  }
};

export const cambiarPrivacidadAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const [album] = await conexion.query(
      "SELECT privacidad FROM albumes WHERE id = ?",
      [id]
    );

    if (album.length === 0) {
      return res.status(404).json({
        mensaje: "Álbum no encontrado"
      });
    }

    const nuevaPrivacidad =
      album[0].privacidad === "publico"
        ? "privado"
        : "publico";

    await conexion.query(
      "UPDATE albumes SET privacidad = ? WHERE id = ?",
      [nuevaPrivacidad, id]
    );

    res.json({
      mensaje: "Privacidad actualizada"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al cambiar privacidad",
      error: error.message
    });
  }
};

export const eliminarAlbumAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await conexion.query(
      "DELETE FROM imagenes WHERE album_id = ?",
      [id]
    );

    await conexion.query(
      "DELETE FROM albumes WHERE id = ?",
      [id]
    );

    res.json({
      mensaje: "Álbum eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar álbum",
      error: error.message
    });
  }
};





export const obtenerAlbumesPublicos = async (req, res) => {
  try {
    const [albumes] = await conexion.query(
      `SELECT * FROM albumes
       WHERE estado = 'aprobado'
       AND privacidad = 'publico'`
    );

    res.json(albumes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener álbumes",
      error: error.message
    });
  }
};


export const obtenerMisAlbumes = async (req, res) => {
  try {
    const [albumes] = await conexion.query(
      `SELECT * FROM albumes
       WHERE estado = 'aprobado'
       AND usuario_id = ?`,
      [req.usuario.id]
    );

    res.json(albumes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener mis álbumes",
      error: error.message
    });
  }
};

