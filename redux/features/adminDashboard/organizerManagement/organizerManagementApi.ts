import { baseApi } from "@/redux/api/baseApi";

const organizerManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrganizers: builder.query({
            query: () => ({
                url: 'api/organizer-list/',
                method: 'GET',
            }),
            providesTags: ['Organizers'],
        }),
    })
})

export const { useGetAllOrganizersQuery } = organizerManagementApi;