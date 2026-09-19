export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    createdAt: string;
}

export type NewBranchInput = Pick<Branch, "name" | "address" | "phone">;
export type BranchUpdateInput = Partial<Pick<Branch, "name" | "address" | "phone">>;
