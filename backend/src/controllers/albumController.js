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

export const obtenerAlbumesPublicos = async (req, res) => {
  try {
    const [albumes] = await conexion.query(
      "SELECT * FROM albumes WHERE estado = 'aprobado'"
    );

    res.json(albumes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener galería"
    });
  }
};