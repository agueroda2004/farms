import express from "express";
import granjaRoutes from "./routes/granja.route.js";
import usuarioRoutes from "./routes/usuario.route.js";
import authRoutes from "./auth/routes/auth.route.js";
import razaRoutes from "./routes/raza.route.js";
import jaulaRoutes from "./routes/jaula.route.js";
import cerdasRoutes from "./routes/cerda.route.js";
import abortoRoutes from "./routes/cerda.route.js";
import cerdaRemovidaRoutes from "./routes/cerdaRemovida.route.js";
import berracoRoutes from "./routes/berraco.route.js";
import berracoRemovidoRoutes from "./routes/berracoRemovido.route.js";
import operarioRoutes from "./routes/operario.route.js";
import servicioRoutes from "./routes/servicio.routes.js";
import parideraRoutes from "./routes/paridera.route.js";
import vacunaRoutes from "./routes/vacuna.routes.js";
import partoRoutes from "./routes/parto.route.js";
import enfermedadPreDesteteRoutes from "./routes/enfermedadPreDestete.route.js";
import muertoPreDesteteRoutes from "./routes/muertoPreDestete.route.js";
import adopcionesRoutes from "./routes/adopcion.route.js";
import donacionesRoutes from "./routes/donacion.route.js";
import destetesRoutes from "./routes/destete.route.js";
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
app.use("/api/jaulas", jaulaRoutes);
app.use("/api/razas", razaRoutes);
app.use("/api/cerdas", cerdasRoutes);
app.use("/api/cerdasRemovidas", cerdaRemovidaRoutes);
app.use("/api/abortos", abortoRoutes);
app.use("/api/berracos", berracoRoutes);
app.use("/api/berracosRemovidos", berracoRemovidoRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/operarios", operarioRoutes);
app.use("/api/vacunas", vacunaRoutes);
app.use("/api/parideras", parideraRoutes);
app.use("/api/partos", partoRoutes);
app.use("/api/enfermedad", partoRoutes);
app.use("/api/enfermedadPreDestete", enfermedadPreDesteteRoutes);
app.use("/api/muertoPreDestete", muertoPreDesteteRoutes);
app.use("/api/adopciones", adopcionesRoutes);
app.use("/api/donaciones", donacionesRoutes);
app.use("/api/destetes", destetesRoutes);

app.use("/api/usuario", usuarioRoutes);
app.use("/api/auth", authRoutes);

// Manejo básico de errores (middleware)
app.use(handlePrismaError);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;
