import fs from "fs";
import path from "path";

export const analizarImagen = async (rutaArchivo) => {
  try {
    const stats = fs.statSync(rutaArchivo);

    const extension = path.extname(rutaArchivo).toLowerCase();

    let sospechoso = false;
    let razones = [];

    if (
      extension !== ".jpg" &&
      extension !== ".jpeg" &&
      extension !== ".png"
    ) {
      sospechoso = true;
      razones.push("Extensión no permitida");
    }

    if (stats.size > 5 * 1024 * 1024) {
      sospechoso = true;
      razones.push("Archivo demasiado grande");
    }

    const buffer = fs.readFileSync(rutaArchivo);

    const contenido = buffer.toString("hex");

    if (contenido.includes("504b0304")) {
      sospechoso = true;
      razones.push("Posible archivo comprimido oculto");
    }

    return {
      estado: sospechoso ? "sospechoso" : "limpio",
      resultado: razones.length > 0
        ? razones.join(", ")
        : "Imagen limpia"
    };

  } catch (error) {
    return {
      estado: "sospechoso",
      resultado: "Error analizando imagen"
    };
  }
};