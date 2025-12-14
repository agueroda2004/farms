import * as service from "../services/berracoService.js";
import { Prisma } from "@prisma/client";

export const createBerraco = async (req, res, next) => {
  try {
    const data = req.body;
    const berraco = await service.createBerraco(data);
    res.status(201).json({ message: "Berraco created successfully", berraco });
  } catch (error) {
    next(error);
  }
};

export const listBerracos = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const berracos = await service.listBerracos(Number(granja_id));

    res.status(200).json(berracos);
  } catch (error) {
    next(error);
  }
};

export const getBerracoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const berraco = await service.getBerracoById(Number(id));
    if (!berraco) {
      return res.status(404).json({ error: "Berraco not found." });
    }
    res.status(200).json(berraco);
  } catch (error) {
    next(error);
  }
};

export const updateBerraco = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedBerraco = await service.updateBerraco(Number(id), req.body);
    res
      .status(201)
      .json({ message: "Berraco updated successfully", updatedBerraco });
  } catch (error) {
    next(error);
  }
};
