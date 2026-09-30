import { NewBranch, Branch } from "../domain/branch.entity";
import { BranchRepositoryPort } from "../ports/branch-repository.port";
import { assertValidName } from "../../../shared/validators";
import { assertValidPhone } from "../domain/branch.rules";

export class CreateBranchUseCase {
    constructor(private readonly branches: BranchRepositoryPort) { }

    async execute(input: NewBranch): Promise<Branch> {
        assertValidName(input.name, "nombre de sucursal");
        assertValidPhone(input.phone);
        return this.branches.create(input);
    }
}
