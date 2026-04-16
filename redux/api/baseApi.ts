import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store";
// import { ar } from "date-fns/locale";
// import { setUser } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers;
    }
});



// const baseQueryWithRefreshToken = async (args: any, api: any, extraOptions: any) => {
//     let result = await baseQuery(args, api, extraOptions);
//     if (result.error && result.error.status === 401) {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`, {
//             method: 'POST',
//             credentials: 'include',
//         });
//         const data = await res.json();

//         const user = (api.getState() as RootState).auth.user;

//         api.dispatch(
//             setUser({
//                 user,
//                 token: data.access,
//             })
//         );
//         result = await baseQuery(args, api, extraOptions);
//     }
//     return result;
// }   



export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQuery,
    tagTypes: ['Profile'],
    endpoints: () => ({})
})
