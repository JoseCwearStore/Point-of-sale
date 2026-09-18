export interface Unit {
    id: string;
    name: string;
    abbreviation: string;
    createdAt: string;
}

export type NewUnitInput = Pick<Unit, "name" | "abbreviation">;
export type UnitUpdateInput = Partial<Pick<Unit, "name" | "abbreviation">>;