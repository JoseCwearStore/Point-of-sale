import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct
} from "./product.api";

import type { NewProductInput, ProductUpdateInput } from "./product.types";

const PRODUCTS_KEYS = ["products"];

export function useProductsQuery() {
    return useQuery({
        queryKey: PRODUCTS_KEYS,
        queryFn: getProducts
    });
}

export function useProductMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: NewProductInput) => createProduct(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS });
        },
    });
}

export function useUpdateProductMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string, input: ProductUpdateInput }) => updateProduct(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS });
        }
    });
}

export function useDeleteProductMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string }) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS })
        }
    });
}

