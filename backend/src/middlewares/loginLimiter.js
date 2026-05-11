import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    mensaje: "Demasiados intentos de login. Intente nuevamente más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false
});