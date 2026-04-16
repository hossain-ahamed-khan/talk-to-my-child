import { baseApi } from "@/redux/api/baseApi";

const profileSettingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        profileSetting: builder.mutation({
            query: (formData) => ({
                url: 'api/account/',
                method: 'PUT',
                body: formData
            })
        }),
    })
})

export const { useProfileSettingMutation } = profileSettingApi;