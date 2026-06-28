import { baseApi } from "@/redux/api/baseApi";

const profileInfoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfileInfo: builder.query({
            query: () => ({
                url: '/auth/profile/',
                method: 'GET',
            }),
        }),
    })
})

export const { useGetProfileInfoQuery } = profileInfoApi;