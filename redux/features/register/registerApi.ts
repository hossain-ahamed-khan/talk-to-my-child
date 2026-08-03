import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userInfo) => ({
                url: 'auth/register/',
                method: 'POST',
                body: userInfo,
            }),
        }),
        verifyOtp: builder.mutation({
            query: (payload) => ({
                url: 'auth/verify-otp/',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const { useRegisterMutation, useVerifyOtpMutation } = authApi;