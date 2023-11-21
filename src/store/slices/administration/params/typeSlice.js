import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {store} from "../../../index";
import {Request} from "../../../../utils/axios";
import {FormMode} from "../../../../enums/FormMode";

export const searchTypes = createAsyncThunk('/types/search', ()=>
{
    const key = store.getState().type.typeKey
    const typeGroups = store.getState().type.typeGroups.map(tg=>tg.id);
    let typePage = store.getState().type.typePage

    return Request({url:`/types/search?key=${key}&typeGroups=${typeGroups}&page=${typePage}&size=5`})
        .then(resp=> {return resp.data})
})
const initialType = {uniqueCode: '', name: '', typeGroup: '', oldUniqueCode: ''};
const typeSlice = createSlice(
    {
    name: "type",
    initialState: {loading: false, types: {}, error: '', typeKey: '', typePage: 0, typeGroups: [],
        formOpened: false, currentType: initialType, formMode: FormMode.NEW},
    reducers:
    {
        typeKeyChanged: (state, action) =>
        {
            state.typeKey = action.payload
        },
        typeGroupsChanged: (state, action) =>
        {
            state.typeGroups = action.payload
        },
        typePageChanged: (state, action) =>
        {
            state.typePage = action.payload
        },
        typeFormOpened: (state, action)=>
        {
            state.formOpened = true;
            state.currentType = action.payload.currentType
            state.formMode = action.payload.formMode
        },
        typeFormClosed: (state)=>
        {
            state.formOpened = false;
            state.currentType = initialType
        }
    },
    extraReducers: builder =>
    {
        builder.addCase(searchTypes.pending, (state)=>
        {
            state.loading = true;
            state.error = '';
        })
        builder.addCase(searchTypes.fulfilled, (state, action) =>
        {
            state.loading = false;
            state.types = action.payload;
            state.error = '';
        })

        builder.addCase(searchTypes.rejected, (state, action) =>
        {
            state.loading = false;
            state.types = {};
            state.error = action.error.message;
        })
    }
})
const userReducer = typeSlice.reducer;
export  default userReducer

export const typeActions = typeSlice.actions

