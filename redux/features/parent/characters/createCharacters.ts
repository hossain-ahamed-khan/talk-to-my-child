import { baseApi } from "@/redux/api/baseApi";

import type { CharacterProfile } from "./characterList";

export type CreateCharacterResponse = {
    success: boolean;
    data: CharacterProfile;
    message: string;
};

export type UpdateCharacterRequest = {
    id: number;
    formData: FormData;
};

export type DeleteCharacterResponse = {
    success: boolean;
    message: string;
};

const createCharacterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCharacter: builder.mutation<CreateCharacterResponse, FormData>({
            query: (formData) => ({
                url: "characters/",
                method: "POST",
                body: formData,
            }),
        }),
        updateCharacter: builder.mutation<CreateCharacterResponse, UpdateCharacterRequest>({
            query: ({ id, formData }) => ({
                url: `characters/${id}/`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ['Character'],
        }),
        deleteCharacter: builder.mutation<DeleteCharacterResponse, number>({
            query: (id) => ({
                url: `characters/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ['Character'],
        }),
    }),
});

export const {
    useCreateCharacterMutation,
    useUpdateCharacterMutation,
    useDeleteCharacterMutation,
} = createCharacterApi;