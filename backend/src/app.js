import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import conexion from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import twofaRoutes from "./routes/twofaRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

async function probarConexion() {
  try {
    const connection = await conexion.getConnection();
    console.log("Base de datos conectada");
    connection.release();
  } catch (error) {
    console.log(error);
  }
}

probarConexion();

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginResourcePolicy: {
      policy: "same-site"
    }
  })
);
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/2fa", twofaRoutes);




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);










const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100
});

app.use(limiter);

app.get("/", (req, res) => {
  res.json({
    mensaje: "SecureFrame Gallery API funcionando"
  });
});

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
  console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
});