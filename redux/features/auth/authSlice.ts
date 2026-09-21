import { RootState } from '@/redux/store'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TUser = {
    id: string;
    email: string;
    full_name: string;
    profile_photo: string | null;
    referral_code: string | null;
    last_login: string | null;
    credit_balance?: number;
};

export type TAuthRole = string | null;

export type TAuthPayload = {
    user: TUser | null;
    token: string | null;
    refreshToken?: string | null;
    role?: TAuthRole;
};

// Define a type for the slice state
interface IAuthState {
    token: string | null;
    refreshToken: string | null;
    user: TUser | null;
    role: TAuthRole;
}

// Define the initial state using that type
const initialState: IAuthState = {
    token: null,
    refreshToken: null,
    user: null,
    role: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
            state.role = null
        },
        setUser: (state, action: PayloadAction<TAuthPayload>) => {
            const { user, token, refreshToken, role } = action.payload
            state.user = user
            state.token = token
            state.refreshToken = refreshToken ?? null
            state.role = role ?? null
        },
    },
})

export const { login, logout, setUser } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectToken = (state: RootState) => state.auth.token
export const selectUser = (state: RootState) => state.auth.user

export default authSlice.reducer