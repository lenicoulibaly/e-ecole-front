import axios from "axios";
import {accessTokenHasExpired, setTokens} from "../services/auth/AuthService";

const bakendAddress = process.env.REACT_APP_BACKEND_ADDRESS; 
const axiosClient = axios.create({baseURL: bakendAddress})



export const Request = async ({...options})=>
{
    const accessTokenKey = 'e-ecole-access-token';
    const refreshTokenKey = 'e-ecole-refresh-token';
    if(accessTokenHasExpired())
    {
        const refreshToken = localStorage.getItem(refreshTokenKey)
        axiosClient.defaults.headers.common.Authorization = `Bearer ${refreshToken}`;
        await axiosClient.get('/users/refresh-token').then(token=>setTokens(token.data)).catch(err=>console.log('refresh-token error : ', err));
    }
    return getAxiosClient(accessTokenKey, options);
}

export const RefreshTokenRequest = ({...options})=>
{
    const refreshTokenKey = 'e-ecole-refresh-token';
    return getAxiosClient(refreshTokenKey, options);
}

const getAxiosClient = (tokenKey, {...options})=>
{
    const token = localStorage.getItem(tokenKey)
    if(token) axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    const onSuccess = (response)=>response;
    const onError = (error)=>
    {
        return error;
    }
    return axiosClient({...options}).then(onSuccess).catch(onError);
}