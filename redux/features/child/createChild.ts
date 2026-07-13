import { baseApi } from "@/redux/api/baseApi";

export type CreateChildRequest = {
    email: string;
    password: string;
    name: string;
    age: number;
    parent: string;
    profile_photo: string | null;
    focus_area: string[];
    interests: string[];
    dislikes: string[];
};

export type CreateChildResponseData = {
    id: string;
    last_login: string | null;
    name: string;
    age: number;
    email: string;
    profile_photo: string | null;
    focus_area: string[];
    personality_traits: string[];
    interests: string[];
    dislikes: string[];
    is_active: boolean;
    is_staff: boolean;
    parent: string;
};

export type CreateChildResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: CreateChildResponseData;
    errors: unknown;
};


const createChildApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createChild: builder.mutation<CreateChildResponse, CreateChildRequest>({
            query: (body) => ({
                url: "child/",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useCreateChildMutation } = createChildApi;