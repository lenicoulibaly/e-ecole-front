/**
 * axios setup to use mock service
 */

import axios from 'axios';
import {accessTokenHasExpired, setTokens} from "../services/auth/AuthService";

export const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:7000'
export const accessTokenKey = 'e-ecole-access-token';
export const refreshTokenKey = 'e-ecole-refresh-token';
const axiosServices = axios.create({ baseURL: baseUrl });
export const Request = async ({...options})=>
{
    if(accessTokenHasExpired())
    {
        const refreshToken = localStorage.getItem(refreshTokenKey)
        axiosServices.defaults.headers.common.Authorization = `Bearer ${refreshToken}`;
        await axiosServices.get('/users/refresh-token').then(token=>setTokens(token.data)).catch(err=>console.log('refresh-token error : ', err));
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
    if(token) axiosServices.defaults.headers.common.Authorization = `Bearer ${token}`;
    const onSuccess = (response)=>response;
    const onError = (error)=>
    {
        return error;
    }
    return axiosServices({...options}).then(onSuccess).catch(onError);
}


// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
