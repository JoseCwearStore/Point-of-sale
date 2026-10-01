import { Router } from "express";
import { PrismaProductRepository } from "../prisma/product.repository";
import { CreateProductUseCase } from "../../application/create-product.use-case";
import { ListProductsUseCase } from "../../application/list-product.use-case";
import { UpdateProductUseCase } from "../../application/update-product.use-case";
import { DeleteProductUseCase } from "../../application/delete-product.use-case";
import { ProductsController } from "./products.controller";
import { prisma } from "../../../../shared/prisma"

const productRepository = new PrismaProductRepository(prisma);

const createProducUseCase = new CreateProductUseCase(productRepository);
const listProducUseCase = new ListProductsUseCase(productRepository);
const updateProducUseCase = new UpdateProductUseCase(productRepository);
const deleteProducUseCase = new DeleteProductUseCase(productRepository);

const controller = new ProductsController(
    createProducUseCase,
    updateProducUseCase,
    deleteProducUseCase,
    listProducUseCase,
);

export const productRoutes = Router();

productRoutes.post("/", controller.create);
productRoutes.get("/", controller.list);
productRoutes.put("/:id", controller.update);
productRoutes.delete("/:id", controller.delete);