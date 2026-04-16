import { baseApi } from "@/redux/api/baseApi";

const createAdminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAdmin: builder.mutation({
            query: (userInfo) => ({
                url: 'api/super-admin-create-account/',
                method: 'POST',
                body: userInfo
            }),
            invalidatesTags: ['Administrators'],
        }),
    })
})

export const { useCreateAdminMutation } = createAdminApi;