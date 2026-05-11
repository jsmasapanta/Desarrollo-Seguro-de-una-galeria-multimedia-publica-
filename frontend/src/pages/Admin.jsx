import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Admin() {
  const [albumes, setAlbumes] = useState([]);
  const [cuarentena, setCuarentena] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const cargarAlbumes = async () => {
    try {
      const respuesta = await api.get("/album/pendientes", { headers });
      setAlbumes(respuesta.data);
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al cargar álbumes");
    }
  };

  const cargarCuarentena = async () => {
    try {
      const respuesta = await api.get("/image/cuarentena", { headers });
      setCuarentena(respuesta.data);
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al cargar cuarentena");
    }
  };

  const aprobarAlbum = async (id) => {
    try {
      const respuesta = await api.put(`/album/aprobar/${id}`, {}, { headers });
      setMensaje(respuesta.data.mensaje);
      cargarAlbumes();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al aprobar álbum");
    }
  };

  const aprobarImagen = async (id) => {
    try {
      const respuesta = await api.put(`/image/aprobar/${id}`, {}, { headers });
      setMensaje(respuesta.data.mensaje);
      cargarCuarentena();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al aprobar imagen");
    }
  };

  const rechazarImagen = async (id) => {
    try {
      const respuesta = await api.put(`/image/rechazar/${id}`, {}, { headers });
      setMensaje(respuesta.data.mensaje);
      cargarCuarentena();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al rechazar imagen");
    }
  };

  useEffect(() => {
    cargarAlbumes();
    cargarCuarentena();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow">
        <div>
          <h1 className="text-2xl font-bold">Panel Administrador</h1>
          <p className="text-sm text-slate-300">
            Supervisión de álbumes e imágenes sospechosas
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm">
            {usuario?.nombre || "Administrador"}
          </span>

          <Link
            to="/dashboard"
            className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold"
          >
            Panel usuario
          </Link>

          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Galería
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {mensaje && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl">
            {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Álbumes pendientes</p>
            <h2 className="text-4xl font-bold text-blue-700">
              {albumes.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Imágenes en cuarentena</p>
            <h2 className="text-4xl font-bold text-red-600">
              {cuarentena.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Controles activos</p>
            <h2 className="text-4xl font-bold text-green-600">
              8
            </h2>
          </div>
        </div>

        <section className="bg-white p-8 rounded-2xl shadow mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Solicitudes de álbumes
          </h2>

          {albumes.length === 0 ? (
            <p className="text-gray-500">
              No hay álbumes pendientes.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {albumes.map((album) => (
                <div
                  key={album.id}
                  className="border border-gray-200 rounded-xl p-5 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {album.titulo}
                    </h3>

                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      {album.estado}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-2">
                    {album.descripcion}
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    Privacidad: {album.privacidad}
                  </p>

                  <button
                    onClick={() => aprobarAlbum(album.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Aprobar álbum
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Imágenes en cuarentena
          </h2>

          {cuarentena.length === 0 ? (
            <p className="text-gray-500">
              No hay imágenes sospechosas.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cuarentena.map((img) => (
                <div
                  key={img.id}
                  className="border border-red-200 bg-red-50 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {img.nombre_archivo}
                    </h3>

                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      {img.estado}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Resultado:</strong> {img.resultado_analisis}
                  </p>

                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Motivo:</strong> {img.motivo}
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    Álbum ID: {img.album_id}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => aprobarImagen(img.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Aprobar
                    </button>

                    <button
                      onClick={() => rechazarImagen(img.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Rechazar
                    </button>
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

export default Admin;