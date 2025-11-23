import express from "express";
import granjaRoutes from "./routes/granja.route.js";
import usuarioRoutes from "./routes/usuario.route.js";
import authRoutes from "./auth/routes/auth.js";
import razaRoutes from "./routes/raza.route.js";
import jaulaRoutes from "./routes/jaula.route.js";
import cerdasRoutes from "./routes/cerda.route.js";
import abortoRoutes from "./routes/cerda.route.js";
import cerdaRemovidaRoutes from "./routes/cerdaRemovida.route.js";
import { handlePrismaError } from "./validators/prisma/prismaValidator.js";
import {
  authMiddleware,
  checkGranjaAccess,
} from "./auth/middlewares/authMiddleware.js";

const app = express();

app.use(express.json());

app.use("/api/granja", granjaRoutes);

app.use(authMiddleware);

// Rutas
app.use("/api/usuario", usuarioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/razas", razaRoutes);
app.use("/api/jaulas", jaulaRoutes);
app.use("/api/cerdas", cerdasRoutes);
app.use("/api/cerdasRemovidas", cerdaRemovidaRoutes);
app.use("/api/abortos", abortoRoutes);

// Manejo básico de errores (middleware)
app.use(handlePrismaError);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;
