import { baseApi } from "@/redux/api/baseApi";

import type { CharacterProfile } from "./characterList";

export type CreateCharacterResponse = {
    success: boolean;
    data: CharacterProfile;
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
    }),
});

export const { useCreateCharacterMutation } = createCharacterApi;