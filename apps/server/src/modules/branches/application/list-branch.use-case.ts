import { Branch } from "../domain/branch.entity";
import { BranchRepositoryPort } from "../ports/branch-repository.port";

export class ListBranchesUseCase {
    constructor(private readonly branches: BranchRepositoryPort) { }

    async execute(): Promise<Branch[]> {
        return this.branches.list();
    }
}
