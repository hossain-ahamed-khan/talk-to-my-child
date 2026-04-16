import { baseApi } from "@/redux/api/baseApi";

const partnerManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPartners: builder.query({
            query: () => ({
                url: 'api/partner-list/',
                method: 'GET',
            }),
            providesTags: ['Partners'],
        }),
    })
})

export const { useGetAllPartnersQuery } = partnerManagementApi;