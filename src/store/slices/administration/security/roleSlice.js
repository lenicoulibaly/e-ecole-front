import {createSlice} from '@reduxjs/toolkit'
import {FormMode} from "../../../../enums/FormMode";
import {InitialCreateRoleDTO} from "../../../../views/administration/security/roles/RoleTypes";

const currentRole = {}
const roleSlice = createSlice(
    {
    name: "role",
    initialState: {loading: false, roles: {}, error: '', key: '', page: 0, size: 5,
        formMode: FormMode.NEW, currentRole: currentRole, formOpened: false},
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
        },
        searchPending:(state)=>
        {
            state.isLoading = true;
            state.error = '';
        },
        searchFulfilled:(state, action)=>
        {
            state.isLoading = false;
            state.roles = action.payload
            state.error = '';
        },
        searchFailed:(state, action)=>
        {
            state.isLoading = false;
            state.error = action.payload;
            alert(action.payload);
        },
        formOpened: (state, action)=>
        {
            state.formOpened = true;
            state.currentRole = action.payload.currentRole
            state.formMode = action.payload.formMode
        },
        formClosed: (state)=>
        {
            state.formOpened = false;
            state.currentRole = InitialCreateRoleDTO
        }
    }
})
const roleReducer = roleSlice.reducer;
export  default roleReducer;

export const roleActions = roleSlice.actions;

