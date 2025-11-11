import express from "express";
import granjaRoutes from "./routes/granja.js";
import usuarioRoutes from "./routes/usuario.js";
import authRoutes from "./auth/routes/auth.js";
import razaRoutes from "./routes/raza.js";
import { handlePrismaError } from "./validators/prisma/prismaValidator.js";

const app = express();

app.use(express.json());

// Rutas
app.use("/api/granja", granjaRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/razas", razaRoutes);

// Manejo básico de errores (middleware)
app.use(handlePrismaError);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;
