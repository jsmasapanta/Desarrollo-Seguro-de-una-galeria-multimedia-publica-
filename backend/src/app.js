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

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("src/uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/2fa", twofaRoutes);



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