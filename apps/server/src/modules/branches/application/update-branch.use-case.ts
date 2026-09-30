import { NotFoundError } from "../../../shared/errors";
import { BranchUpdate, Branch } from "../domain/branch.entity";
import { BranchRepositoryPort } from "../ports/branch-repository.port";
import { assertValidName } from "../../../shared/validators";
import { assertValidPhone } from "../domain/branch.rules";

export class UpdateBranchUseCase {
    constructor(private readonly branches: BranchRepositoryPort) { }

    async execute(id: string, input: BranchUpdate): Promise<Branch> {
        const existing = await this.branches.findById(id);
        if (!existing) throw new NotFoundError("Sucursal", id);

        if (input.name !== undefined) assertValidName(input.name, "nombre de sucursal");
        if (input.phone !== undefined) assertValidPhone(input.phone);

        return this.branches.update(id, input);
    }
}
