import {Type, type Static} from "@sinclair/typebox"

export const problemStatus = Type.Enum({pending: "pending", canceled: 'canceled', approved: 'approved'})

export const problemDto = Type.Object({
    id: Type.String(),
    title: Type.String(),
    inputs: Type.String(),
    description: Type.String(),
    algorithm: Type.String(),
    created_by: Type.String(),
    status: problemStatus,
    created_at: Type.Number(),
    updated_at: Type.Number()
}, {$id: "problem-dto",additionalProperties: false,})

export const publicProblemDto = Type.Object({
    id: Type.String(),
    title: Type.String(),
    description: Type.String(),created_by: Type.String(),
    status: problemStatus,
    created_at: Type.Number(),
    updated_at: Type.Number()
}, {$id: 'public-problem-dto',additionalProperties: false})

export type Problem = Static<typeof problemDto>;
export type PublicProblem = Static<typeof problemDto>;