import { baseApi } from "@/redux/api/baseApi";

const registerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userInfo) => ({
                url: 'api/register/',
                method: 'POST',
                body: userInfo
            })
        }),
    })
})

export const { useRegisterMutation } = registerApi;