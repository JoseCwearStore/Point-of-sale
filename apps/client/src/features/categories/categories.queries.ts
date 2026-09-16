import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory
} from "./categories.api"

import type { CategoryUpdateInput, NewCategoryInput } from "./categories.types"

const CATEGORIES_KEYS = ["categories"];

export function useCategoriesQuery() {
    return useQuery({
        queryKey: CATEGORIES_KEYS,
        queryFn: getCategories
    });
}

export function useCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: NewCategoryInput) => createCategory(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS })
        },
    });
}

export function useUpdateCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string, input: CategoryUpdateInput }) => updateCategory(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS });
        }
    });
}

export function useDeleteCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string }) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS });
        }
    });
}