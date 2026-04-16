import { baseApi } from "@/redux/api/baseApi";

const changePasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        changePassword: builder.mutation({
            query: (data) => ({
                url: 'api/change-password/',
                method: 'POST',
                body: data
            })
        }),
    })
})

export const { useChangePasswordMutation } = changePasswordApi;