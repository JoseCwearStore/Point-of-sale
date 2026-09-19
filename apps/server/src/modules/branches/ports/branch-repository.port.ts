import type { Branch, NewBranch, BranchUpdate } from "../domain/branch.entity";

export interface BranchRepositoryPort {
    create(input: NewBranch): Promise<Branch>;
    update(id: string, input: BranchUpdate): Promise<Branch>;
    findById(id: string): Promise<Branch | null>;
    list(): Promise<Branch[]>;
    delete(id: string): Promise<Branch>;
}
