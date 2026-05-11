import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Gallery() {
  const [albumes, setAlbumes] = useState([]);
  const [imagenes, setImagenes] = useState([]);

  const cargarDatos = async () => {
    const albumesRes = await api.get("/album/publicos");
    const imagenesRes = await api.get("/image/publicas");

    setAlbumes(albumesRes.data);
    setImagenes(imagenesRes.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white px-8 py-5 flex justify-between items-center shadow">
        <div>
          <h1 className="text-3xl font-bold">SecureFrame Gallery</h1>
          <p className="text-blue-100 text-sm">
            Galería multimedia pública segura
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-8 py-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Galería pública
        </h2>

        <p className="text-gray-600">
          Solo se muestran álbumes aprobados e imágenes que superaron los controles de seguridad.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-12">
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-5">
            Álbumes aprobados
          </h3>

          {albumes.length === 0 ? (
            <p className="text-gray-500">
              No hay álbumes públicos disponibles.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {albumes.map((album) => (
                <div
                  key={album.id}
                  className="bg-white p-6 rounded-2xl shadow border border-gray-200"
                >
                  <h4 className="text-xl font-bold text-blue-700 mb-2">
                    {album.titulo}
                  </h4>

                  <p className="text-gray-600 mb-3">
                    {album.descripcion}
                  </p>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {album.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-5">
            Imágenes verificadas
          </h3>

          {imagenes.length === 0 ? (
            <p className="text-gray-500">
              No hay imágenes públicas verificadas.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {imagenes.map((img) => (
                <div
                  key={img.id}
                  className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200"
                >
                  <img
                    src={`http://localhost:3000/uploads/${img.ruta_archivo
                        .split("\\")
                        .pop()}`}
                    alt={img.nombre_archivo}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-5">
                    <h4 className="font-bold text-gray-800 mb-1">
                      {img.nombre_archivo}
                    </h4>

                    <p className="text-sm text-gray-500 mb-3">
                      Álbum: {img.album}
                    </p>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Imagen verificada
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Gallery;