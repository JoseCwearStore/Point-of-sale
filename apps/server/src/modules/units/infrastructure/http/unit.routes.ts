import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaUnitRepository } from "../prisma/unit.repository";
import { CreateUnitUseCase } from "../../application/create-unit.use-case";
import { ListUnitsUseCase } from "../../application/list-unit.use-case";
import { UpdateUnitUseCase } from "../../application/update-unit.use-case";
import { DeleteUnitUseCase } from "../../application/delete-unit.use-case";
import { UnitController } from "./units.controller";

const prisma = new PrismaClient();
const unitRepository = new PrismaUnitRepository(prisma);

const createUnitUseCase = new CreateUnitUseCase(unitRepository);
const listUnitUseCase = new ListUnitsUseCase(unitRepository);
const updateUnitUseCase = new UpdateUnitUseCase(unitRepository);
const deleteUnitUseCase = new DeleteUnitUseCase(unitRepository);

const controller = new UnitController(
    createUnitUseCase,
    updateUnitUseCase,
    deleteUnitUseCase,
    listUnitUseCase
);

export const unitRoutes = Router();

unitRoutes.post("/", controller.create);
unitRoutes.get("/", controller.list);
unitRoutes.put("/:id", controller.update);
unitRoutes.delete("/:id", controller.delete);