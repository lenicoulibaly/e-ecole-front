import { useContext } from "react";
import { createContext } from "react";
import {RefreshTokenRequest } from "../../utils/axiosUtils";

const accessTokenKey = 'e-ecole-access-token';
const refreshTokenKey = 'e-ecole-refresh-token';

export const getAccessToken = ()=>localStorage.getItem(accessTokenKey);
export const getRefreshToken = ()=>localStorage.getItem(refreshTokenKey);

export const  setTokens = (token)=>
{
    localStorage.setItem(accessTokenKey, token.accessToken);
    localStorage.setItem(refreshTokenKey, token.refreshToken);
}

const  removeTokens = ()=>
{
    localStorage.removeItem(accessTokenKey); 
    localStorage.removeItem(refreshTokenKey);
}

export const doRefreshTokenRequest = ()=>
{
    return RefreshTokenRequest({url: '/users/refresh-token'});
}
/*const getClaimFromAccessToken = (claimName)=>
{
    const accessToken = getAccessToken();
    const decodeToken = parseToken(accessToken);
    if(decodeToken) return decodeToken.claimName;
}*/

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
//const getAuthUser = ()=> {return {nom: 'Leni', prenom: 'Coul'}}

const AuthContext = createContext(null);
const authObject = {isFullyAuthenticated, accessTokenHasExpired, isNotAuthenticatedAtAll, authUser: getAuthUser(), doRefreshTokenRequest, removeTokens, setTokens, getAccessToken, getRefreshToken};
export const AuthProvider = ({children})=>
{
    return <AuthContext.Provider value={authObject}>
        {children}
        </AuthContext.Provider>
}

export const useAuth = ()=>
{
    return useContext(AuthContext);
}