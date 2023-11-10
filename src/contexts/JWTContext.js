import PropTypes from 'prop-types';
import {createContext, useEffect, useState} from 'react';

// third-party
import { Chance } from 'chance';


// project imports
//import Loader from 'ui-component/Loader';
import axiosService from 'utils/axios';
import {RefreshTokenRequest} from "../utils/axiosUtils";
import axios from "axios";
import {authActions} from "../store/slices/authSlice";
import {store} from "../store";

//import {useLocation} from "react-router";

const chance = new Chance();


// constant

const accessTokenKey = 'e-ecole-access-token';
const refreshTokenKey = 'e-ecole-refresh-token';



export const getAccessToken = ()=>localStorage.getItem(accessTokenKey);
export const getRefreshToken = ()=>localStorage.getItem(refreshTokenKey);

export const  setTokens = (token)=>
{
    localStorage.setItem(accessTokenKey, token.accessToken);
    localStorage.setItem(refreshTokenKey, token.refreshToken);
}

export const  removeTokens = ()=>
{
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
}

export const doRefreshTokenRequest = ()=>
{
    return RefreshTokenRequest({url: '/users/refresh-token'});
}

const parseToken = (token)=>
{
    if(token)
    {
        return JSON.parse(window.atob(token.split('.')[1]));
    }
    return null;
}

const isFullyAuthenticated = ()=>
{
    const parsedToken = parseToken(getAccessToken());
    if(!parsedToken) return false;
    const expirationTime =  parsedToken.exp *1000;
    return expirationTime > Date.now();
}

export const accessTokenHasExpired = ()=>
{
    if(isFullyAuthenticated()) return false;
    const parsedRefreshToken = parseToken(getRefreshToken());
    if(!parsedRefreshToken) return false
    const refreshTokenExpirationTime =  parsedRefreshToken.exp * 1000;
    if(refreshTokenExpirationTime < Date.now()) return false;

    const parsedAccessToken = parseToken(getAccessToken());
    if(!parsedAccessToken) return false;
    const accessTokenExpirationTime =  parsedAccessToken.exp *1000;

    return accessTokenExpirationTime < Date.now();
}

export const isNotAuthenticatedAtAll = ()=>
{
    if(isFullyAuthenticated() || accessTokenHasExpired()) return false;
    return true;
}
const getAuthUser = ()=> parseToken(getAccessToken());


// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);
const authUser = getAuthUser()

export const JWTProvider = ({ children }) => {
    //const [state, dispatch] = useReducer(accountReducer, initialState);
    let [, setIsAuthenticated] = useState(true);
    useEffect(() =>
    {
        const checkConnection = async()=>
        {
            if(isFullyAuthenticated())
            {
                setIsAuthenticated(true);
            }
            else if(accessTokenHasExpired())
            {
                const onRefreshTokenSuccess = (token)=>{
                    setTokens(token.data);
                    setIsAuthenticated(true);
                }
                await doRefreshTokenRequest().then(token=>{onRefreshTokenSuccess(token)}).catch(err=>{store.dispatch(authActions.loginFailed(err));console.log('refresh-token error : ', err)});
            }
            else
            {
                setIsAuthenticated(false);
            }
        }
        checkConnection();
    }, [])

    const onLoginError = (error)=>
    {
        console.log('loginError : ', error)
        store.dispatch(authActions.loginFailed({loginError: error.response.data[0]}))
    }

    const onLoginSuccess = (token)=>
    {
        store.dispatch(authActions.loginSuccessful(token))
    }

    const login = async (username, password) => {
        await axios.post('http://localhost:7000/users/open/login', { username, password })
            .then(resp=>onLoginSuccess(resp.data))
            .catch(err=>onLoginError(err));
    };

    const register = async (email, password, firstName, lastName) => {
        // todo: this flow need to be recode as it not verified
        const id = chance.bb_pin();
        const response = await axiosService.post('/api/account/register', {
            id,
            email,
            password,
            firstName,
            lastName
        });
        let users = response.data;

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = [
                ...JSON.parse(localUsers),
                {
                    id,
                    email,
                    password,
                    name: `${firstName} ${lastName}`
                }
            ];
        }

        window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = () => {
        store.dispatch(authActions.logout())
    };

    const resetPassword = async (email) => {
        console.log(email);
    };

    const updateProfile = () => {};


    const authObject = {login, logout, register, resetPassword, updateProfile, isFullyAuthenticated, accessTokenHasExpired, isNotAuthenticatedAtAll, authUser,
        doRefreshTokenRequest, removeTokens, setTokens, getAccessToken, getRefreshToken};

    return (
        <JWTContext.Provider value={authObject}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
