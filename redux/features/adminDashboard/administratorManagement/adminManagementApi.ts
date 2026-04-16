import { baseApi } from "@/redux/api/baseApi";

const administratorManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAdministrators: builder.query({
            query: () => ({
                url: '/api/admin-list/',
                method: 'GET',
            }),
            providesTags: ['Administrators'],
        }),
    })
})

export const { useGetAllAdministratorsQuery } = administratorManagementApi;