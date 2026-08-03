import { baseApi } from "@/redux/api/baseApi";

export type CharacterProfile = {
    id: number;
    name: string;
    age: number;
    gender: string;
    category: string;
    role: string;
    description: string;
    profile_image: string | null;
    voice_sample: string | null;
    created_at: string;
    updated_at: string;
    created_by: string;
};

export type CharacterListResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: CharacterProfile[];
    errors: unknown;
};

const characterListForChildApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCharacterListForChildApi: builder.query<CharacterProfile[], void>({
            query: () => ({
                url: 'characters/for-child/',
                method: 'GET',
            }),
            transformResponse: (response: CharacterListResponse) => response.data,
        }),
    })
})

export const { useGetCharacterListForChildApiQuery } = characterListForChildApi;