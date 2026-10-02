// infrastructure/http/ — aquí armamos las URLs y conectamos las piezas reales entre sí.
import { Router } from "express";
import { PrismaCategoryRepository } from "../prisma/category.repository";
import { CreateCategoryUseCase } from "../../application/create-category.use-case";
import { ListCategoriesUseCase } from "../../application/list-categories.use-case";
import { UpdateCategoryUseCase } from "../../application/update-category.use-case";
import { DeleteCategoryUseCase } from "../../application/delete-category.use-case";
import { CategoryController } from "./category.controller";
import { PrismaProductRepository } from "../../../products/infrastructure/prisma/product.repository";
import { prisma } from "../../../../shared/prisma"

const categoryRepository = new PrismaCategoryRepository(prisma);
const productRepository = new PrismaProductRepository(prisma);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const listCategoryUseCase = new ListCategoriesUseCase(categoryRepository)
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository, productRepository)

const controller = new CategoryController(
    createCategoryUseCase,
    listCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase
);

export const categoryRoutes = Router();

categoryRoutes.post("/", controller.create)
categoryRoutes.get("/", controller.list)
categoryRoutes.put("/:id", controller.update)
categoryRoutes.delete("/:id", controller.delete)