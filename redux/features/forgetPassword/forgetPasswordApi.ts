import { baseApi } from "@/redux/api/baseApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

// Generic shape of every response your backend returns
export interface ApiEnvelope<T> {
    success: boolean;
    status_code: number;
    message: string;
    data: T | null;
    errors: unknown;
}

interface SendOtpRequest {
    email: string;
}

interface EnterOtpRequest {
    email: string;
    otp_type: "PASSWORD_RESET";
    otp: string;
}

export interface ResetTokenData {
    reset_token: string;
}

interface SetNewPasswordRequest {
    reset_token: string;
    new_password: string;
    confirm_password: string;
}

const authOtpApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation<ApiEnvelope<null>, SendOtpRequest>({
            query: (body) => ({
                url: "auth/password-reset-request/",
                method: "POST",
                body,
            }),
        }),
        enterOtp: builder.mutation<ApiEnvelope<ResetTokenData>, EnterOtpRequest>({
            query: (body) => ({
                url: "auth/verify-otp/",
                method: "POST",
                body,
            }),
        }),
        setNewPassword: builder.mutation<ApiEnvelope<null>, SetNewPasswordRequest>({
            query: (body) => ({
                url: "auth/password-reset/",
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useSendOtpMutation, useEnterOtpMutation, useSetNewPasswordMutation } = authOtpApi;

// Narrows an RTK Query error (FetchBaseQueryError | SerializedError | undefined)
// down to a displayable string, instead of reaching for `error: any`.
export function getErrorMessage(
    error: FetchBaseQueryError | SerializedError | undefined,
    fallback: string
): string {
    if (!error) return fallback;

    if ("status" in error) {
        // FetchBaseQueryError
        const data = error.data as { message?: string } | undefined;
        return data?.message ?? fallback;
    }

    // SerializedError
    return error.message ?? fallback;
}