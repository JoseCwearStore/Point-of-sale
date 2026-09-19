import type { Request, Response } from "express";
import { CreateBranchUseCase } from "../../application/create-branch.use-case";
import { ListBranchesUseCase } from "../../application/list-branch.use-case";
import { UpdateBranchUseCase } from "../../application/update-branch.use-case";
import { DeleteBranchUseCase } from "../../application/delete-branch.use-case";
import { NotFoundError, ConflictError } from "../../../../shared/errors";

export class BranchController {
    constructor(
        private readonly createBranch: CreateBranchUseCase,
        private readonly listBranches: ListBranchesUseCase,
        private readonly updateBranch: UpdateBranchUseCase,
        private readonly deleteBranch: DeleteBranchUseCase,
    ) { }

    create = async (req: Request, res: Response): Promise<void> => {
        const { name, address, phone } = req.body;

        if (typeof name !== "string" || name.trim() === "") {
            res.status(400).json({ error: "El campo 'name' es obligatorio y debe ser texto." });
            return;
        }
        if (typeof address !== "string" || address.trim() === "") {
            res.status(400).json({ error: "El campo 'address' es obligatorio y debe ser texto." });
            return;
        }
        if (typeof phone !== "string" || phone.trim() === "") {
            res.status(400).json({ error: "El campo 'phone' es obligatorio y debe ser texto." });
            return;
        }

        try {
            const branch = await this.createBranch.execute({ name, address, phone });
            res.status(201).json(branch);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error instanceof ConflictError) {
                res.status(409).json({ error: error.message });
                return;
            }
            throw error;
        }
    };

    list = async (_req: Request, res: Response): Promise<void> => {
        const branches = await this.listBranches.execute();
        res.status(200).json(branches);
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name, address, phone } = req.body;

        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "No se encontró el id de la sucursal." });
            return;
        }
        if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
            res.status(400).json({ error: "El campo 'name', si se manda, debe ser texto no vacío." });
            return;
        }
        if (address !== undefined && (typeof address !== "string" || address.trim() === "")) {
            res.status(400).json({ error: "El campo 'address', si se manda, debe ser texto no vacío." });
            return;
        }
        if (phone !== undefined && (typeof phone !== "string" || phone.trim() === "")) {
            res.status(400).json({ error: "El campo 'phone', si se manda, debe ser texto no vacío." });
            return;
        }

        try {
            const branch = await this.updateBranch.execute(id, { name, address, phone });
            res.status(200).json(branch);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error instanceof ConflictError) {
                res.status(409).json({ error: error.message });
                return;
            }
            throw error;
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "No se encontró el id de la sucursal." });
            return;
        }

        try {
            const deletedBranch = await this.deleteBranch.execute(id);
            res.status(200).json({ mensaje: "Sucursal eliminada", sucursal: deletedBranch });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            throw error;
        }
    };
}
