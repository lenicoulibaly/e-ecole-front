import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {store} from "../../../index";
import {Request} from "../../../../utils/axios";

export const searchRoles = createAsyncThunk('/roles/search', ()=>
{
    const {key, page, size} = store.getState().role

    //return Request({url:`/types/search?key=${key}&typeGroups=${typeGroups}&page=${typePage}&size=5`})
     //   .then(resp=> {return resp.data})

    return Request({url: `/roles/search?key=${key}&page=${page}&size=${size}`})
        .then(resp=> {console.log('resp = ', resp); return resp.data})
})

const roleSlice = createSlice(
    {
    name: "role",
    initialState: {loading: false, roles: {}, error: '', key: '', page: 0, size: 5},
    reducers:
    {
        keyChanged: (state, action) =>
        {
            state.key = action.payload
        },
        pageChanged: (state, action) =>
        {
            state.page = action.payload
        },
        sizeChanged: (state, action) =>
        {
            state.size = action.payload
        }
    },

    extraReducers: builder =>
    {
        builder.addCase(searchRoles.pending, (state)=>
        {
            state.loading = true;
            state.error = '';
        })
        builder.addCase(searchRoles.fulfilled, (state, action) =>
        {
            state.loading = false;
            state.roles = action.payload;
            console.log('action.payload = ', action)
            state.error = '';
        })

        builder.addCase(searchRoles.rejected, (state, action) =>
        {
            state.loading = false;
            state.roles = {};
            state.error = action.error.message;
        })
    }
})
const roleReducer = roleSlice.reducer;
export  default roleReducer;

export const roleActions = roleSlice.actions;

