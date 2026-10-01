import { Request, Response } from "express";
import { CreateProductUseCase } from "../../application/create-product.use-case";
import { DeleteProductUseCase } from "../../application/delete-product.use-case";
import { ListProductsUseCase } from "../../application/list-product.use-case";
import { UpdateProductUseCase } from "../../application/update-product.use-case";
import { ConflictError, NotFoundError, ValidationError } from "../../../../shared/errors";

export class ProductsController {
    constructor(
        private readonly createProduct: CreateProductUseCase,
        private readonly updateProduct: UpdateProductUseCase,
        private readonly deleteProduct: DeleteProductUseCase,
        private readonly listProduct: ListProductsUseCase
    ) { }

    create = async (req: Request, res: Response): Promise<void> => {
        const {
            name,
            categoryId,
            unitId,
            hasTax,
            priceWithoutTax,
            imageUrl,
        } = req.body;
        if (typeof name !== "string" || name.trim() === "") {
            res.status(400).json({ error: "El campo 'name' es obligatorio y debe ser texto." });
            return;
        }
        if (typeof priceWithoutTax !== "number") {
            res.status(400).json({ error: "El campo 'precio' es obligatorio y debe ser numerico." });
            return;
        }
        if (typeof categoryId !== "string") {
            res.status(400).json({ error: "Debes seleccionar una 'Categoria' es obligatorio." });
            return;
        }
        if (typeof unitId !== "string") {
            res.status(400).json({ error: "Debes seleccionar una 'Unidad' es obligatorio." });
            return;
        }
        try {
            const product = await this.createProduct.execute({
                name,
                categoryId,
                unitId,
                hasTax,
                priceWithoutTax,
                imageUrl,
            });
            res.status(201).json(product);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error instanceof ConflictError) {
                res.status(409).json({ error: error.message });
                return;
            }
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            throw error;

        }
    }

    list = async (_req: Request, res: Response): Promise<void> => {
        const products = await this.listProduct.execute();
        res.status(200).json(products);
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const {
            name,
            categoryId,
            unitId,
            hasTax,
            priceWithoutTax,
            imageUrl,
        } = req.body;

        if (categoryId !== undefined && (typeof categoryId !== "string" || categoryId.trim() === "")) {
            res.status(400).json({ error: "El campo 'Categoria', si se manda, debes seleccionar uno." });
            return;
        }

        if (unitId !== undefined && (typeof unitId !== "string" || unitId.trim() === "")) {
            res.status(400).json({ error: "El campo 'Unidad', si se manda, debes seleccionar uno." });
            return;
        }

        if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
            res.status(400).json({ error: "El campo 'name', si se manda, debe ser texto no vacío." });
            return;
        }

        if (priceWithoutTax !== undefined && typeof priceWithoutTax !== "number") {
            res.status(400).json({ error: "El campo 'precio' es obligatorio y debe ser numerico." });
            return;
        }

        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "No se encontró el id del producto." });
            return;
        }

        try {
            const product = await this.updateProduct.execute(id, {
                name,
                categoryId,
                unitId,
                hasTax,
                priceWithoutTax,
                imageUrl
            });
            res.status(200).json(product);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error instanceof ConflictError) {
                res.status(409).json({ error: error.message });
                return;
            }
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            throw error;
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "No se encontró el id del producto." });
            return;
        }

        try {
            const deletedProduct = await this.deleteProduct.execute(id);
            res.status(200).json({ mensaje: 'Producto eliminado', producto: deletedProduct });

        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            throw error;
        }
    }
}
