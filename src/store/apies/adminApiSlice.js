import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {baseUrl} from "../../utils/axios";
export const adminApiSlice = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    endpoints: (build) =>
    ({
        searchPrivileges: build.query({
         query: (page, size, key, typePrvUniqueCodes)=>`/privileges/open/search?page=${page}&size=${size}&key=${key}&typePrvUniqueCodes=${typePrvUniqueCodes}`
        })
    })
})

export const {useSearchPrivilegesQuery} = adminApiSlice;