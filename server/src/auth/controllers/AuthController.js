import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prismaClient.js";
import * as service from "../services/authService.js";

const JWT_SECRET = process.env.JWT_SECRET;

// ! validar si email y password no vienen vacios
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await service.getUsuarioByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email inválido" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password inválido" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        admin: user.admin,
        granja_id: user.granja_id,
      },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
