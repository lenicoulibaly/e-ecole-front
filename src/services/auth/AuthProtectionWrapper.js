import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';

import { doRefreshTokenRequest, useAuth } from './AuthService';

const AuthProtectionWrapper = ({children}) => 
{
    let [isAuthenticated, setIsAuthenticated] = useState(true);
    const location = useLocation();
    const authContext = useAuth();
    useEffect(() =>
    {
        const checkConnection = async()=>
        {
            if(authContext.isFullyAuthenticated())
            {
                setIsAuthenticated(true);
            }
            else if(authContext.accessTokenHasExpired())
            {
                const onRefreshTokenSuccess = (token)=>{
                    authContext.setTokens(token.data);
                    setIsAuthenticated(true);
                }
                await doRefreshTokenRequest().then(token=>{onRefreshTokenSuccess(token)}).catch(err=>{console.log('refresh-token error : ', err)});
            }
            else
            {
                sessionStorage.setItem('lastLocation', location.pathname); 
                setIsAuthenticated(false);
            }
        }
        checkConnection();
    }, [authContext?.authUser?.connectionId, location.pathname])
    
    if(isAuthenticated) 
    {
        return children
    }
    else
    {
        //navigate('/pages/login/login3');
        console.log('Is not auth');
        return <Navigate to='/login' state={{path: location.pathname}} />;
    }
    
};

export default AuthProtectionWrapper;