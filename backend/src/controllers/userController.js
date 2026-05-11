export const perfilUsuario = async (req, res) => {
  res.json({
    mensaje: "Ruta protegida",
    usuario: req.usuario
  });
};

export const panelAdmin = async (req, res) => {
  res.json({
    mensaje: "Bienvenido administrador"
  });
};