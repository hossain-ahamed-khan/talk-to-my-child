import { baseApi } from "@/redux/api/baseApi";

const sendOtpApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation({
            query: (email) => ({
                url: 'auth/password-reset-request/',
                method: 'POST',
                body: email
            })
        }),
    })
})

export const { useSendOtpMutation } = sendOtpApi;



const enterOtpApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        enterOtp: builder.mutation({
            query: (formData) => ({
                url: 'auth/verify-otp/',
                method: 'POST',
                body: formData
            })
        }),
    })
})

export const { useEnterOtpMutation } = enterOtpApi;



const setNewPasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        setNewPassword: builder.mutation({
            query: (formData) => ({
                url: 'auth/password-reset/',
                method: 'POST',
                body: formData
            })
        }),
    })
})

export const { useSetNewPasswordMutation } = setNewPasswordApi;