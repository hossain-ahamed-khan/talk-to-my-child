import { baseApi } from "@/redux/api/baseApi";

export type ProfileInfo = {
    id: string;
    full_name: string;
    email: string;
    profile_photo: string | null;
    role: string;
    is_email_verified: boolean;
    credit_balance: number;
    referral_code: string | null;
    date_joined: string;
    last_login: string;
};

export type UpdateProfileResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: ProfileInfo;
    errors: unknown;
};

const profileInfoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfileInfo: builder.query<ProfileInfo, void>({
            query: () => ({
                url: 'auth/profile/',
                method: 'GET',
            }),
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
            query: (formData) => ({
                url: 'auth/profile/',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['Profile'],
        }),
    })
})

export const { useGetProfileInfoQuery, useUpdateProfileMutation } = profileInfoApi;