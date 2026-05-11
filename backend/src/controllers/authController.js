import bcrypt from "bcrypt";
import conexion from "../config/db.js";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    const [usuarioExiste] = await conexion.query(
      "SELECT id FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (usuarioExiste.length > 0) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado"
      });
    }

    const passwordCifrado = await bcrypt.hash(password, 10);

    await conexion.query(
      "INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, correo, passwordCifrado, "usuario"]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message
    });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    const [usuarios] = await conexion.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const usuario = usuarios[0];

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error en login",
      error: error.message
    });
  }
};