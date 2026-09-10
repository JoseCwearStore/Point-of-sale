// infrastructure/http/ — aquí armamos las URLs y conectamos las piezas reales entre sí.
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaCategoryRepository } from "../prisma/category.repository";
import { CreateCategoryUseCase } from "../../application/create-category.use-case";
import { ListCategoriesUseCase } from "../../application/list-categories.use-case";
import { UpdateCategoryUseCase } from "../../application/update-category.use-case";
import { CategoryController } from "./category.controller";

const prisma = new PrismaClient();
const categoryRepository = new PrismaCategoryRepository(prisma);

const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const listCategoryUseCase = new ListCategoriesUseCase(categoryRepository)
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)

const controller = new CategoryController(createCategoryUseCase, listCategoryUseCase, updateCategoryUseCase);

export const categoryRoutes = Router();

categoryRoutes.post("/", controller.create)
categoryRoutes.get("/", controller.list)
categoryRoutes.put("/:id", controller.update)