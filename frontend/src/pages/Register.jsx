import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const registrar = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await api.post("/auth/registro", {
        nombre,
        correo,
        password
      });

      setMensaje(respuesta.data.mensaje);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || "Error en registro"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Crear Cuenta
        </h1>

        <form
          onSubmit={registrar}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
          />

          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Registrarse
          </button>
        </form>

        {mensaje && (
          <p className="text-center text-red-500 mt-4">
            {mensaje}
          </p>
        )}

        <p className="text-center mt-6 text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;