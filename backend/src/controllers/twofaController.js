import speakeasy from "speakeasy";
import qrcode from "qrcode";
import conexion from "../config/db.js";

export const generar2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `SecureFrame Gallery (${req.usuario.id})`
    });

    await conexion.query(
      "UPDATE usuarios SET twofa_secret = ? WHERE id = ?",
      [secret.base32, req.usuario.id]
    );

    const qr = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      mensaje: "Código QR generado",
      qr,
      secret: secret.base32
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error generando 2FA",
      error: error.message
    });
  }
};

export const activar2FA = async (req, res) => {
  try {
    const { codigo } = req.body;

    const [usuarios] = await conexion.query(
      "SELECT twofa_secret FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );

    const usuario = usuarios[0];

    const valido = speakeasy.totp.verify({
      secret: usuario.twofa_secret,
      encoding: "base32",
      token: codigo,
      window: 1
    });

    if (!valido) {
      return res.status(401).json({
        mensaje: "Código 2FA inválido"
      });
    }

    await conexion.query(
      "UPDATE usuarios SET twofa_enabled = true WHERE id = ?",
      [req.usuario.id]
    );

    res.json({
      mensaje: "2FA activado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error activando 2FA",
      error: error.message
    });
  }
};