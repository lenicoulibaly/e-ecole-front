import Loadable from 'ui-component/Loadable';
import { lazy } from 'react';
import { useLocation } from 'react-router';

const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const { isFullyAuthenticated, accessTokenHasExpired, doRefreshTokenRequest } = require("./AuthService")

const withAuthProtection = (WrappedComp)=>
{
    const ProtectedComp = ({...props})=>
    {
        const location = useLocation();
  
        if(isFullyAuthenticated()) {
            console.log('Is fully authenticated');
            return <WrappedComp {...props}/>}
        else if(accessTokenHasExpired())
        {
            console.log('accessTokenHasExpired');
            doRefreshTokenRequest();
            return <WrappedComp {...props}/>;
        }
        else 
        {
            console.log('Is not auth at all');
            sessionStorage.setItem('lastLocation', location.pathname);
            return <AuthLogin3 />;
        }
    }
    return ProtectedComp;
}
export default withAuthProtection;
