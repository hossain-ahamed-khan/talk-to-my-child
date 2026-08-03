import { baseApi } from "@/redux/api/baseApi";

export interface LastMessage {
    role: "assistant" | "user";
    content: string;
    timestamp: string;
}

export interface ConversationSession {
    id: number;
    child_name: string;
    character_name: string;
    started_at: string;
    last_message: LastMessage;
}

export interface CallHistoryListResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: ConversationSession[];
    errors: unknown | null;
}

const callHistoryListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCallHistoryList: builder.query<CallHistoryListResponse, void>({
            query: () => ({
                url: 'talk/conversations/',
                method: 'GET',
            }),
        }),
    })
})

export const { useGetCallHistoryListQuery } = callHistoryListApi;