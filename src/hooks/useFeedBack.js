import {useEffect} from "react";
import {dispatch} from "../store";
import {feedBackActions} from "../store/slices/feedBackSlice";

export const useFeedBackEffects = (isCreateSuccess, isCreateError, createError, isUpdateSuccess, isUpdateError, updateError)=>
{
    return useEffect(() =>
    {
        if(isUpdateError)
        {
            dispatch(feedBackActions.operationFailed(updateError))
        }
        else if(isCreateError)
        {
            dispatch(feedBackActions.operationFailed(createError))
        }
        if(isCreateSuccess || isUpdateSuccess)
        {
            dispatch(feedBackActions.operationSuccessful(["Opération réalisée avec succès"]))
        }
    }, [updateError, createError, isCreateSuccess, isUpdateSuccess]);
}