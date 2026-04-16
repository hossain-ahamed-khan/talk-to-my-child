import { baseApi } from "@/redux/api/baseApi";

const adminOverviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminOverview: builder.query({
            query: () => ({
                url: '/api/users-overview/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetAdminOverviewQuery } = adminOverviewApi;