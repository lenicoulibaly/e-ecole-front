import Snackbar from '@mui/material/Snackbar';
import {dispatch} from "../../../store";
import {feedBackActions} from "../../../store/slices/feedBackSlice";
import {useSelector} from "react-redux";
import {Alert} from "@mui/material";


const FloatingAlert = () => {
    const {open: feedBackOpen, messages: feedBackMessages, mode: feedBackMode} = useSelector(state => state.feedBack)
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={feedBackOpen}
            autoHideDuration={6000} // Adjust the duration as needed

        >
            <Alert style={{color: "white"}} Alert elevation={6} variant="filled" severity={feedBackMode.severity} onClose={() => {dispatch(feedBackActions.dialogClosed())}}>
                {

                    Array.isArray(feedBackMessages) ? feedBackMessages?.map((message, index)=>
                    {
                        return <div key={index}>{message}</div>
                    }) : feedBackMessages
                }
            </Alert>
        </Snackbar>
    );
};

export default FloatingAlert;
