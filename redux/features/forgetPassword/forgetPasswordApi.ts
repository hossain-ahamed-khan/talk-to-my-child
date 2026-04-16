import { baseApi } from "@/redux/api/baseApi";

const sendOtpApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation({
            query: (email) => ({
                url: 'api/send-otp/',
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
                url: 'api/otp-verify/',
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
                url: 'api/forgot-password-reset/',
                method: 'POST',
                body: formData
            })
        }),
    })
})

export const { useSetNewPasswordMutation } = setNewPasswordApi;