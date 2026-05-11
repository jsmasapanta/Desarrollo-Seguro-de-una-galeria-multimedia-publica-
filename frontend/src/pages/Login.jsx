import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [codigo2FA, setCodigo2FA] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await api.post("/auth/login", {
        correo,
        password,
        codigo2FA
      });

      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(respuesta.data.usuario)
      );

      if (respuesta.data.usuario.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || "Error en login"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          SecureFrame Gallery
        </h1>

        <form
          onSubmit={iniciarSesion}
          className="flex flex-col gap-4"
        >
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

          <input
            type="text"
            placeholder="Código 2FA"
            value={codigo2FA}
            onChange={(e) => setCodigo2FA(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Ingresar
          </button>
        </form>

        {mensaje && (
          <p className="text-red-500 text-center mt-4">
            {mensaje}
          </p>
        )}

        <p className="text-center mt-6 text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;