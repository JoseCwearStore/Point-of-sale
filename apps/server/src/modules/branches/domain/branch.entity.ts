export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    createdAt: Date;
}

export type NewBranch = Pick<Branch, "name" | "address" | "phone">;
export type BranchUpdate = Partial<Pick<Branch, "name" | "address" | "phone">>;
