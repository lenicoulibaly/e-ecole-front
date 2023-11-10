import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {store} from "../../../index";
import {Request} from "../../../../utils/axios";

export const searchUsers = createAsyncThunk('/users/search', ()=>
{
    const key = store.getState().user.userKey
    console.log('key', key)
    return Request({url: `/users/search?key=${key}`})
        .then(resp=> {
            return resp.data
        })
})

const userSlice = createSlice(
    {
    name: "user",
    initialState: {loading: false, users: {}, error: '', userKey: ''},
    reducers:
    {
        userKeyChanged: (state, action) =>
        {
            state.userKey = action.payload
            console.log('action.payload = ', action.payload)
        }
    },

    extraReducers: builder =>
    {
        builder.addCase(searchUsers.pending, (state)=>
        {
            state.loading = true;
            state.error = '';
        })
        builder.addCase(searchUsers.fulfilled, (state, action) =>
        {
            state.loading = false;
            state.users = action.payload;
            state.error = '';
        })

        builder.addCase(searchUsers.rejected, (state, action) =>
        {
            state.loading = false;
            state.users = {};
            state.error = action.error.message;
        })
    }
})
const userReducer = userSlice.reducer;
export  default userReducer;

export const userActions = userSlice.actions;

