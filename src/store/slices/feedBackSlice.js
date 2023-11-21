import {createSlice} from "@reduxjs/toolkit";
import {FeedBackMode} from "../../enums/FeedBackMode";
import {dispatch} from "../index";

const initialState = {mode: FeedBackMode.SUCCESS, messages: FeedBackMode.SUCCESS.messages, open: false}
const feedBackSlice = createSlice({
    name: "feedBack",
    initialState: initialState,
    reducers: {
        operationSuccessful: (state, action) => {
            state.mode = FeedBackMode.SUCCESS;
            state.messages = action.payload;
            state.open = true
            const func = ()=> dispatch(feedBackActions.dialogClosed())
            setTimeout(func, FeedBackMode.SUCCESS.timeOut)
        },
        operationFailed: (state, action)=>
        {
            state.mode = FeedBackMode.ERROR;
            state.messages = action.payload;
            state.open = true
            const func = ()=> dispatch(feedBackActions.dialogClosed())
            setTimeout(func, FeedBackMode.ERROR.timeOut)
        },
        dialogClosed: (state)=>
        {
            state.open = false
        }
    },
    extraReducers: builder =>
    {
        builder.addCase(feedBackActions.operationFailed, state=>
        {
            const func = ()=> state.open = false
            setTimeout(func, FeedBackMode.ERROR.timeOut)
        })
    }
})

const feedBackReducer = feedBackSlice.reducer;
export  default feedBackReducer;
export const feedBackActions = feedBackSlice.actions;