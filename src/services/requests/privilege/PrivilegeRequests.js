import {Request} from "../../../utils/axios";


export const searchPrivileges = (page, size, key, prvTypeCodes)=> Request({url: `/privileges/search?page=${page}&size=${size}&key=${key}&typePrvUniqueCodes=${prvTypeCodes}`
}).then(resp=>resp.data).catch(err=>err)

export const getPrvTypes = ()=>Request({url: `/privileges/types`}).then(resp=>resp.data).catch(err=>err)