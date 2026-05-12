import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>SecureFrame Gallery</h1>
        <p>Galería multimedia pública con enfoque en desarrollo seguro.</p>

        <div className="home-buttons">
          <button onClick={() => navigate("/gallery")}>
            Ver galería pública
          </button>

          <button onClick={() => navigate("/login")}>
            Ingresar como usuario
          </button>

          <button onClick={() => navigate("/admin-login")}>
            Ingresar como administrador
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;