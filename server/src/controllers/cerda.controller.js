import * as service from "../services/cerda.service.js";
import { Prisma } from "@prisma/client";

export const createCerda = async (req, res, next) => {
  try {
    const cerda = await service.createCerda(req.body);
    res.status(201).json({
      message: `Cerda created successfully.`,
      cerda,
    });
  } catch (error) {
    next(error);
  }
};

export const listCerdas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const cerdas = await service.listCerdas(Number(granja_id));

    res.json(cerdas);
  } catch (error) {
    next(error);
  }
};

export const getCerdaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cerda = await service.getCerdaById(Number(id));
    if (!cerda) return res.status(404).json({ error: "Cerda not found." });

    res.json(cerda);
  } catch (error) {
    next(error);
  }
};

export const updateCerda = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cerda = await service.updateCerda(Number(id), req.body);
    res.json({
      message: `Cerda updated successfully.`,
      cerda,
    });
  } catch (error) {
    next(error);
  }
};
