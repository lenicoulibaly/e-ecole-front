import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';

// project imports
import useAuth from 'hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }) =>
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
        return <Navigate to='/login' state={{path: location.pathname}} />;
    }
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
