import { NotFoundError } from "../../../shared/errors";
import { BranchUpdate, Branch } from "../domain/branch.entity";
import { BranchRepositoryPort } from "../ports/branch-repository.port";

export class UpdateBranchUseCase {
    constructor(private readonly branches: BranchRepositoryPort) { }

    async execute(id: string, input: BranchUpdate): Promise<Branch> {
        const existing = await this.branches.findById(id);
        if (!existing) throw new NotFoundError("Sucursal", id);
        return this.branches.update(id, input);
    }
}
