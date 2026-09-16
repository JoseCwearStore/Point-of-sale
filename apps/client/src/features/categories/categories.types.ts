export interface Category {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
}

export type NewCategoryInput = Pick<Category, "name"> & Partial<Pick<Category, "slug">>;
export type CategoryUpdateInput = Partial<Pick<Category, "name" | "slug">>;