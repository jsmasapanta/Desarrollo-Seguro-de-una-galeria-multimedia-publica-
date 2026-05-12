import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [privacidad, setPrivacidad] = useState("publico");
  const [albumId, setAlbumId] = useState("1");
  const [imagen, setImagen] = useState(null);
  const [mensajeAlbum, setMensajeAlbum] = useState("");
  const [mensajeImagen, setMensajeImagen] = useState("");
  const [albumes, setAlbumes] = useState([]);
  const cargarAlbumes = async () => {
  const res = await api.get("/album/publicos");
          setAlbumes(res.data);
        };

        cargarAlbumes();
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const crearAlbum = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await api.post(
        "/album/crear",
        {
          titulo,
          descripcion,
          privacidad
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMensajeAlbum(respuesta.data.mensaje);
      setTitulo("");
      setDescripcion("");
      setPrivacidad("publico");
    } catch (error) {
      setMensajeAlbum(
        error.response?.data?.mensaje || "Error al crear álbum"
      );
    }
  };

  const subirImagen = async (e) => {
    e.preventDefault();

    try {
      const datos = new FormData();
      datos.append("album_id", albumId);
      datos.append("imagen", imagen);

      const respuesta = await api.post(
        "/image/subir",
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMensajeImagen(
        `${respuesta.data.analisis.estado}: ${respuesta.data.analisis.resultado}`
      );
      setImagen(null);
    } catch (error) {
      setMensajeImagen(
        error.response?.data?.mensaje || "Error al subir imagen"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center shadow">
        <div>
          <h1 className="text-2xl font-bold">SecureFrame Gallery</h1>
          <p className="text-sm text-blue-100">
            Panel de usuario
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm">
            {usuario?.nombre || "Usuario"}
          </span>

          <Link
            to="/"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold"
          >
            Galería pública
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Solicitar nuevo álbum
          </h2>

          <form onSubmit={crearAlbum} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Título del álbum"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
            />

            <textarea
              placeholder="Descripción del álbum"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 h-32"
            />

            <select
              value={privacidad}
              onChange={(e) => setPrivacidad(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
            >
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
            >
              Enviar a revisión
            </button>
          </form>

          {mensajeAlbum && (
            <p className="mt-4 text-blue-700 font-medium">
              {mensajeAlbum}
            </p>
          )}
        </section>

        <section className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Subir imagen segura
          </h2>

          <form onSubmit={subirImagen} className="flex flex-col gap-4">
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
            >
              <option value="">Seleccione un álbum</option>

              {albumes.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.titulo}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setImagen(e.target.files[0])}
              className="border border-gray-300 p-3 rounded-lg bg-gray-50"
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition"
            >
              Analizar y subir imagen
            </button>
          </form>

          {mensajeImagen && (
            <p className="mt-4 text-green-700 font-medium">
              {mensajeImagen}
            </p>
          )}

          <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <h3 className="font-bold text-gray-700 mb-2">
              Controles aplicados
            </h3>
            <ul className="text-sm text-gray-600 list-disc pl-5">
              <li>Validación MIME real</li>
              <li>Detección de payload oculto</li>
              <li>Sanitización de metadatos</li>
              <li>Cuarentena automática</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;