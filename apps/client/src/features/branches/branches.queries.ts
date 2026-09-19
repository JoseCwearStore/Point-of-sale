import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createBranch,
    deleteBranch,
    getBranches,
    updateBranch,
} from "./branches.api";

import type { NewBranchInput, BranchUpdateInput } from "./branches.types";

const BRANCHES_KEYS = ["branches"];

export function useBranchesQuery() {
    return useQuery({
        queryKey: BRANCHES_KEYS,
        queryFn: getBranches,
    });
}

export function useBranchMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: NewBranchInput) => createBranch(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS });
        },
    });
}

export function useUpdateBranchMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: BranchUpdateInput }) => updateBranch(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS });
        },
    });
}

export function useDeleteBranchMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string }) => deleteBranch(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS });
        },
    });
}
