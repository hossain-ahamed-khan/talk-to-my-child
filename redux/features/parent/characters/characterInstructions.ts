import { baseApi } from "@/redux/api/baseApi";

export type CharacterInstruction = {
    id: string | number;
    child_id?: string | number;
    character_id?: string | number;
    parent_instructions: string;
    created_at?: string;
    updated_at?: string;
};

type CharacterInstructionResponse = {
    success?: boolean;
    status_code?: number;
    message?: string;
    data?: CharacterInstruction | CharacterInstruction[];
    results?: CharacterInstruction[];
    errors?: unknown;
};

type InstructionPayload = {
    parent_instructions: string;
};

function normalizeInstructions(response: CharacterInstructionResponse | CharacterInstruction[] | CharacterInstruction) {
    if (Array.isArray(response)) return response;
    if ("id" in response && "parent_instructions" in response) return [response];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.results)) return response.results;
    if (response.data) return [response.data];
    return [];
}

const characterInstructionsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCharacterInstructions: builder.query<CharacterInstruction[], { childId: string; characterId: number }>({
            query: ({ childId, characterId }) => ({
                url: `talk/characters/instractions/${childId}/${characterId}/`,
                method: "GET",
            }),
            transformResponse: normalizeInstructions,
            providesTags: (_result, _error, { characterId }) => [
                { type: "Character" as const, id: `INSTRUCTIONS-${characterId}` },
            ],
        }),
        createCharacterInstruction: builder.mutation<CharacterInstruction, { childId: string; characterId: number; body: InstructionPayload }>({
            query: ({ childId, characterId, body }) => ({
                url: "talk/characters/instractions/",
                method: "POST",
                body: {
                    child: childId,
                    character_id: characterId,
                    ...body,
                },
            }),
            invalidatesTags: (_result, _error, { characterId }) => [
                { type: "Character", id: `INSTRUCTIONS-${characterId}` },
            ],
        }),
        updateCharacterInstruction: builder.mutation<CharacterInstruction, { childId: string | number; characterId: number; body: InstructionPayload }>({
            query: ({ childId, characterId, body }) => ({
                url: `talk/characters/instractions/${childId}/${characterId}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { characterId }) => [
                { type: "Character", id: `INSTRUCTIONS-${characterId}` },
            ],
        }),
        deleteCharacterInstruction: builder.mutation<unknown, { childId: string | number; characterId: number }>({
            query: ({ childId, characterId }) => ({
                url: `talk/characters/instractions/${childId}/${characterId}/`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { characterId }) => [
                { type: "Character", id: `INSTRUCTIONS-${characterId}` },
            ],
        }),
    }),
});

export const {
    useGetCharacterInstructionsQuery,
    useCreateCharacterInstructionMutation,
    useUpdateCharacterInstructionMutation,
    useDeleteCharacterInstructionMutation,
} = characterInstructionsApi;
