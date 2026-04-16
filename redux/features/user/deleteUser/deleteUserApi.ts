import { baseApi } from "@/redux/api/baseApi";

const deleteUserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `api/admin-delete/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Organizers', 'Partners', 'Administrators'],
        }),
    })
})

export const { useDeleteUserMutation } = deleteUserApi;