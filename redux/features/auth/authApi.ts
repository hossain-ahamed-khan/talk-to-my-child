import { baseApi } from "@/redux/api/baseApi";

import type { TUser } from "./authSlice";

export type TLoginRequest = {
    email: string;
    password: string;
};

export type TLoginResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        role: string;
        user_data: TUser;
    };
    errors: unknown;
};

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<TLoginResponse, TLoginRequest>({
            query: (userInfo) => ({
                url: 'auth/login/email/',
                method: 'POST',
                body: userInfo
            })
        }),
    })
})

export const { useLoginMutation } = authApi;