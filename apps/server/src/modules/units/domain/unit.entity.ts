export interface Unit {
    id: string;
    name: string;
    abbreviation: string;
    createdAt: Date;
}

export type NewUnit = Pick<Unit, "name" | "abbreviation">;
export type UnitUpdate = Partial<Pick<Unit, "name" | "abbreviation">>;
