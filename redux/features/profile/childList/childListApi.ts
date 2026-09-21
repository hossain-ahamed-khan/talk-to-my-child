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

type ChildListItemResponse = Omit<ChildProfile, "name"> & {
    name?: string;
    full_name?: string;
};

export type ChildListResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: ChildListItemResponse[];
    errors: unknown;
};

export type UpdateChildRequest = {
    email: string;
    password?: string;
    name: string;
    age: number;
    parent: string;
    profile_photo: string | null;
    focus_area: string[];
    interests: string[];
    dislikes: string[];
};

export type ChildMutationResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: ChildProfile;
    errors: unknown;
};

const childListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChildListApi: builder.query<ChildProfile[], void>({
            query: () => ({
                url: 'child/',
                method: 'GET',
            }),
            transformResponse: (response: ChildListResponse) => response.data.map((child) => ({
                ...child,
                name: child.name ?? child.full_name ?? "",
            })),
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: "ChildProfile" as const, id })),
                    { type: "ChildProfile" as const, id: "LIST" },
                ]
                : [{ type: "ChildProfile" as const, id: "LIST" }],
        }),
        updateChild: builder.mutation<ChildMutationResponse, { id: string; body: UpdateChildRequest }>({
            query: ({ id, body }) => ({
                url: `child/${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "ChildProfile", id },
                { type: "ChildProfile", id: "LIST" },
            ],
        }),
        deleteChild: builder.mutation<ChildMutationResponse, string>({
            query: (id) => ({
                url: `child/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "ChildProfile", id },
                { type: "ChildProfile", id: "LIST" },
            ],
        }),
    })
})

export const {
    useGetChildListApiQuery,
    useUpdateChildMutation,
    useDeleteChildMutation,
} = childListApi;