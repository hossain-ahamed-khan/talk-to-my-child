import { baseApi } from "@/redux/api/baseApi";

export interface CharacterProgress {
    child_id: string;
    child_name: string;
    character_name: string;
    character_category: string;
    message_count: number;
    target: number;
}

export interface AcheivementsResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: CharacterProgress[];
    errors: unknown | null;
}

const achievementsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAcheivements: builder.query<AcheivementsResponse, void>({
            query: () => ({
                url: 'achievements/interactions/',
                method: 'GET',
            }),
        }),
    })
})

export const { useGetAcheivementsQuery } = achievementsApi;