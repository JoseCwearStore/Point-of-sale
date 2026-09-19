import { NotFoundError } from "../../../shared/errors";
import { Branch } from "../domain/branch.entity";
import { BranchRepositoryPort } from "../ports/branch-repository.port";

export class DeleteBranchUseCase {
    constructor(private readonly branches: BranchRepositoryPort) { }

    async execute(id: string): Promise<Branch> {
        const existing = await this.branches.findById(id);
        if (!existing) throw new NotFoundError("Sucursal", id);
        return this.branches.delete(id);
    }
}
