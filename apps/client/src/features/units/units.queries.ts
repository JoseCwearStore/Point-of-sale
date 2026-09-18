import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createUnit,
    deleteUnit,
    getUnits,
    updateUnit
} from "./units.api";

import type { NewUnitInput, UnitUpdateInput } from "./units.types";

const UNITS_KEYS = ["units"];

export function useUnitsQuery() {
    return useQuery({
        queryKey: UNITS_KEYS,
        queryFn: getUnits
    });
}

export function useUnitMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: NewUnitInput) => createUnit(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: UNITS_KEYS });
        },
    });
}

export function useUpdateUnitMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string, input: UnitUpdateInput }) => updateUnit(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: UNITS_KEYS });
        }
    });
}

export function useDeleteUnitMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string }) => deleteUnit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: UNITS_KEYS })
        }
    });
}

