import {createSlice} from "@reduxjs/toolkit";
import {removeTokens, setTokens} from "../../contexts/JWTContext";
import axiosService from "../../utils/axios";


const authSlice = createSlice({
    name: "auth",
    initialState: {accessToken: "", refreshToken: "", loginError: "", isLoggedIn: false},
    reducers:
    {
        loginSuccessful: (state, action)=>
        {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.loginError = "";
            state.isLoggedIn = true;
            setTokens(action.payload);
        },

        loginFailed: (state, action)=>
        {
            state.accessToken = '';
            state.refreshToken = '';
            state.loginError = action.payload.loginError
            state.isLoggedIn = false;
            removeTokens();
        },

        logout: ()=>
        {
            removeTokens();
            state.accessToken = '';
            state.refreshToken = '';
            state.loginError = ''
            state.isLoggedIn = false;
            axiosService.get("/users/logout")
        }
    }
});
export default authSlice.reducer;
export const authActions = authSlice.actions;