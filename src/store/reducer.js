// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import menuReducer from './slices/menu';
import userReducer from "./slices/administration/security/userSlice";
import authReducer from "./slices/authSlice";
import typeReducer from "./slices/administration/params/typeSlice";
import roleReducer from "./slices/administration/security/roleSlice";
import privilegeReducer from "./slices/administration/security/privilegeSlice";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'berry-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    customer: customerReducer,
    contact: contactReducer,
    product: productReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    mail: mailReducer,
    user: userReducer,
    menu: menuReducer,
    auth: authReducer,
    type: typeReducer,
    role: roleReducer,
    privilege: privilegeReducer,
});

export default reducer;
