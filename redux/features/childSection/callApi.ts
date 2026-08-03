// src/redux/features/childSection/callApi.ts
import { baseApi } from "@/redux/api/baseApi";

export interface CallCharacter {
    id: number;
    name: string;
}

export interface CreateCallResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        room_id: string;
        ws_url: string;
        character: CallCharacter;
    };
    errors: string | null;
}

const createCallApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCall: builder.mutation<CreateCallResponse, number>({
            query: (characterId) => ({
                url: `characters/${characterId}/call/`,
                method: "POST",
            }),
        }),
    }),
});

export const { useCreateCallMutation } = createCallApi;