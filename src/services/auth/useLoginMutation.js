import axios from "axios";

const { useMutation } = require("react-query")

const useLoginMutation = (options)=>
{
    const bakendAddress = process.env.REACT_APP_BACKEND_ADDRESS;
    const loginRequest  = (loginDto)=> axios.post(`${bakendAddress}/users/open/login`, loginDto);
    return useMutation(loginRequest, {...options})
}

export default useLoginMutation;