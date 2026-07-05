import { baseApi } from "@/redux/api/baseApi";

export type ChildProfile = {
    id: string;
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
    last_login: string | null;
};

export type ChildListResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: ChildProfile[];
    errors: unknown;
};

const childListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChildListApi: builder.query<ChildProfile[], void>({
            query: () => ({
                url: 'child/',
                method: 'GET',
            }),
            transformResponse: (response: ChildListResponse) => response.data,
        }),
    })
})

export const { useGetChildListApiQuery } = childListApi;