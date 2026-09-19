import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBranchRepository } from "../prisma/branch.repository";
import { CreateBranchUseCase } from "../../application/create-branch.use-case";
import { ListBranchesUseCase } from "../../application/list-branch.use-case";
import { UpdateBranchUseCase } from "../../application/update-branch.use-case";
import { DeleteBranchUseCase } from "../../application/delete-branch.use-case";
import { BranchController } from "./branch.controller";

const prisma = new PrismaClient();
const branchRepository = new PrismaBranchRepository(prisma);

const createBranchUseCase = new CreateBranchUseCase(branchRepository);
const listBranchesUseCase = new ListBranchesUseCase(branchRepository);
const updateBranchUseCase = new UpdateBranchUseCase(branchRepository);
const deleteBranchUseCase = new DeleteBranchUseCase(branchRepository);

const controller = new BranchController(
    createBranchUseCase,
    listBranchesUseCase,
    updateBranchUseCase,
    deleteBranchUseCase,
);

export const branchRoutes = Router();

branchRoutes.post("/", controller.create);
branchRoutes.get("/", controller.list);
branchRoutes.put("/:id", controller.update);
branchRoutes.delete("/:id", controller.delete);
