import {createSlice} from '@reduxjs/toolkit'
const initialPrv = {privilegeCode: '',privilegeName: 'Créer un rôle', typeCode: ''};
const privilegeSlice = createSlice(
    {
    name: "privilege",
    initialState: {loading: false, privileges: {}, error: '', key: '', page: 0, size: 5, prvTypeCodes: [], currentPrv: initialPrv},
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
        typeCodesChanged: (state, action) =>
        {
            state.prvTypeCodes = action.payload
        },
        searchPrivilegesPending:(state)=>
        {
            state.isLoading = true;
            state.error = '';
        },
        searchPrivilegesFulfilled:(state, action)=>
        {
            state.isLoading = false;
            state.privileges = action.payload
            state.error = '';
        },
        searchPrivilegesFailed:(state, action)=>
        {
            state.isLoading = false;
            state.error = action.payload;
        },
        formOpened: (state, action)=>
        {
            state.formOpened = true;
            state.currentPrv = action.payload.currentPrv
            state.formMode = action.payload.formMode
        },
        formClosed: (state)=>
        {
            state.formOpened = false;
            state.currentPrv = initialPrv
        }
    }
})
const privilegeReducer = privilegeSlice.reducer;
export  default privilegeReducer;

export const privilegeActions = privilegeSlice.actions;

