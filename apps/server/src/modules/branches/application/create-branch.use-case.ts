import { NewBranch, Branch } from "../domain/branch.entity";
import { BranchRepositoryPort } from "../ports/branch-repository.port";

export class CreateBranchUseCase {
    constructor(private readonly branches: BranchRepositoryPort) { }

    async execute(input: NewBranch): Promise<Branch> {
        return this.branches.create(input);
    }
}
