import jwt from "jsonwebtoken";
import prisma from "../../prismaClient.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const checkGranjaAccess = async (req, res, next) => {
  try {
    // 1. Obtener el ID del usuario desde el token (puesto por authMiddleware)
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Autenticación requerida." });
    }

    // 2. Obtener el ID de la granja de la solicitud (de params o body)
    let requestGranjaId = req.user.granja_id; // Default al granja_id del usuario

    if (!requestGranjaId) {
      return res.status(400).json({
        message: "No se proporcionó el ID de la granja en la solicitud.",
      });
    }

    // 3. Buscar al usuario para obtener su granja_id
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { granja_id: true },
    });

    if (!user || !user.granja_id) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado o no asociado a una granja." });
    }

    // 4. Comparar el granja_id del usuario con el de la solicitud
    if (user.granja_id !== Number(requestGranjaId)) {
      // 403 Forbidden: El usuario está autenticado pero no tiene permiso
      return res.status(403).json({
        message:
          "Acceso denegado. No tienes permiso para acceder a esta granja.",
      });
    }

    // 5. Si todo es correcto, continuar
    next();
  } catch (error) {
    next(error);
  }
};
