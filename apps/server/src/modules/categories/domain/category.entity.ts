// domain/  - que Es una categoria, sin saber que existe Express ni Prisma 

export interface Category {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
}

// Lo que pide el usuario para crear una categoria: el nombre es obligatorio,
// el slug es opcional (si no lo manda lo generamos nosotros a partiot del nombre).

export type NewCategory = Pick<Category, "name"> & Partial<Pick<Category, "slug">>;

// Lo que en verdad se guarda en la base de datos: aquí el slug ya es
// obligatorio, porque para este punto en el flujo ya lo calculamos.
export type CategoryToPersist = Omit<NewCategory, "slug"> & Pick<Category, "slug">;

// Tipo generado para un update 
export type CategoryUpdate = Partial<Pick<Category, "name" | "slug">>;
