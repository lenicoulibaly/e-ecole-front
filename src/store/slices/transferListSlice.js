import {createSlice} from "@reduxjs/toolkit";

const transferListSlice = createSlice({
    name: 'transferList',
    initialState: {selected: []},
    reducers: {
        selectionChanged: (state, action)=>
        {
            state.selected = action.payload
        }
    }
});

const transferListReducer = transferListSlice.reducer;
export  default transferListReducer;
export const transferListActions = transferListSlice.actions;