import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Admin() {
  const [albumes, setAlbumes] = useState([]);
  const [albumesAdmin, setAlbumesAdmin] = useState([]);
  const [cuarentena, setCuarentena] = useState([]);
  const [imagenesSubidas, setImagenesSubidas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const cargarAlbumes = async () => {
    try {
      const res = await api.get("/album/pendientes", { headers });
      setAlbumes(res.data);
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al cargar álbumes");
    }
  };

  const cargarAlbumesAdmin = async () => {
    try {
      const res = await api.get("/album/admin/todos", { headers });
      setAlbumesAdmin(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cargarCuarentena = async () => {
    try {
      const res = await api.get("/image/cuarentena", { headers });
      setCuarentena(res.data);
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al cargar cuarentena");
    }
  };

  const cargarImagenesSubidas = async () => {
    try {
      const res = await api.get("/image/admin/todas", { headers });
      setImagenesSubidas(res.data);
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al cargar imágenes");
    }
  };

  const aprobarAlbum = async (id) => {
    try {
      const res = await api.put(`/album/aprobar/${id}`, {}, { headers });

      setMensaje(res.data.mensaje);

      cargarAlbumes();
      cargarAlbumesAdmin();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al aprobar álbum");
    }
  };


  const cambiarPrivacidad = async (id) => {
  try {
    const res = await api.put(
      `/album/admin/privacidad/${id}`,
      {},
      { headers }
    );

    setMensaje(res.data.mensaje);

    cargarAlbumesAdmin();

  } catch (error) {
    setMensaje(error.response?.data?.mensaje);
  }
};

const eliminarAlbum = async (id) => {
  try {
    const res = await api.delete(
      `/album/admin/eliminar/${id}`,
      { headers }
    );

    setMensaje(res.data.mensaje);

    cargarAlbumesAdmin();
    cargarImagenesSubidas();

  } catch (error) {
    setMensaje(error.response?.data?.mensaje);
  }
};

  const aprobarImagen = async (id) => {
    try {
      const res = await api.put(`/image/aprobar/${id}`, {}, { headers });

      setMensaje(res.data.mensaje);

      cargarCuarentena();
      cargarImagenesSubidas();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al aprobar imagen");
    }
  };

  const rechazarImagen = async (id) => {
    try {
      const res = await api.put(`/image/rechazar/${id}`, {}, { headers });

      setMensaje(res.data.mensaje);

      cargarCuarentena();
      cargarImagenesSubidas();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al rechazar imagen");
    }
  };

  const eliminarImagen = async (id) => {
    try {
      const res = await api.delete(`/image/admin/${id}`, { headers });

      setMensaje(res.data.mensaje);

      cargarImagenesSubidas();
      cargarCuarentena();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al eliminar imagen");
    }
  };

  useEffect(() => {
    cargarAlbumes();
    cargarAlbumesAdmin();
    cargarCuarentena();
    cargarImagenesSubidas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow">
        <div>
          <h1 className="text-2xl font-bold">Panel Administrador</h1>

          <p className="text-sm text-slate-300">
            Supervisión de seguridad y contenido multimedia
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
            Galería pública
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {mensaje && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl">
            {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Álbumes pendientes
            </p>

            <h2 className="text-4xl font-bold text-blue-700">
              {albumes.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Álbumes registrados
            </p>

            <h2 className="text-4xl font-bold text-purple-700">
              {albumesAdmin.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Imágenes en cuarentena
            </p>

            <h2 className="text-4xl font-bold text-red-600">
              {cuarentena.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Imágenes subidas
            </p>

            <h2 className="text-4xl font-bold text-green-600">
              {imagenesSubidas.length}
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Aprobar álbum
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white p-8 rounded-2xl shadow mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Álbumes registrados
          </h2>

          <p className="text-gray-500 mb-6">
            Supervisión general de álbumes y control de privacidad.
          </p>

          {albumesAdmin.length === 0 ? (
  <p className="text-gray-500">
    No hay álbumes registrados.
  </p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {albumesAdmin.map((album) => (
      <div
        key={album.id}
        className="border border-gray-200 rounded-xl p-5 bg-gray-50"
      >
        <h3 className="text-xl font-bold text-blue-700 mb-3">
          {album.titulo}
        </h3>

        <p className="text-sm text-gray-700 mb-2">
          <strong>Descripción:</strong> {album.descripcion}
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <strong>Privacidad:</strong> {album.privacidad}
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <strong>Estado:</strong> {album.estado}
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <strong>Creado por:</strong> {album.usuario}
        </p>

        <p className="text-sm text-gray-700">
          <strong>Total imágenes:</strong> {album.total_imagenes}
        </p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => cambiarPrivacidad(album.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {album.privacidad === "publico"
              ? "Hacer privado"
              : "Hacer público"}
          </button>

          <button
            onClick={() => eliminarAlbum(album.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Eliminar álbum
          </button>
        </div>
      </div>
    ))}
  </div>
)}
</section>

        <section className="bg-white p-8 rounded-2xl shadow mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Imágenes en cuarentena
          </h2>

          <p className="text-gray-500 mb-6">
            Archivos sospechosos detectados automáticamente por el sistema.
          </p>

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

                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Álbum:</strong> {img.album}
                  </p>

                  <p className="text-sm text-gray-700 mb-4">
                    <strong>Subido por:</strong> {img.usuario}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => aprobarImagen(img.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Aprobar
                    </button>

                    <button
                      onClick={() => rechazarImagen(img.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Rechazar
                    </button>

                    <button
                      onClick={() => eliminarImagen(img.id)}
                      className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Imágenes subidas
          </h2>

          <p className="text-gray-500 mb-6">
            Registro general de imágenes cargadas al sistema.
          </p>

          {imagenesSubidas.length === 0 ? (
            <p className="text-gray-500">
              No hay imágenes registradas.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {imagenesSubidas.map((img) => (
                <div
                  key={img.id}
                  className="border border-gray-200 rounded-xl p-5 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {img.nombre_archivo}
                    </h3>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {img.estado}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Álbum:</strong> {img.album}
                  </p>

                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Privacidad:</strong> {img.privacidad}
                  </p>

                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Subido por:</strong> {img.usuario}
                  </p>

                  <p className="text-sm text-gray-700 mb-4">
                    <strong>Resultado:</strong> {img.resultado_analisis}
                  </p>

                  <button
                    onClick={() => eliminarImagen(img.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Eliminar imagen
                  </button>
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