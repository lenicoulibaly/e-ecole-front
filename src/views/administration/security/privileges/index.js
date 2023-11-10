import React, {useEffect} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Autocomplete,
    Button,
    Grid,
    InputAdornment,
    Menu,
    MenuItem,
    OutlinedInput,
    Pagination, TextField,
    Typography
} from '@mui/material';

// project imports
import PrivilegeList from './PrivilegeList';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assetsf
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {dispatch, useSelector} from "../../../../store";
import NewPrivilegeForm from "./NewPrivilegeForm";
import {privilegeActions} from "../../../../store/slices/administration/security/privilegeSlice";
import {useQuery} from "react-query";
import * as PrvRequests from "../../../../services/requests/privilege/PrivilegeRequests"
import {Request} from "../../../../utils/axios";
//import axios from "axios";


const PrivilegeListIndex = () =>
{
    const {key, page, size, prvTypeCodes} = useSelector((state) => state.privilege)
    /*const searchPrivilege = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/privileges/open/search?key=${key}&page=${page}&size=${size}&typePrvUniqueCodes=${typePrvCodes}`);
            return response.data;
        } catch (error) {
            console.log (error); // You can handle errors further in your component
        }
    };*/
    const searchPrivileges = ()=> Request({url: `/privileges/search?page=${page}&size=${size}&key=${key}&typePrvUniqueCodes=${prvTypeCodes}`
    }).then(resp=>resp.data).catch(err=>err)
    const {data, isSuccess, isLoading, isError, error} = useQuery(["searchPrivilege", page, size, key, prvTypeCodes], searchPrivileges, {refetchOnWindowFocus: false});
    const {data: options, isSuccess: optionSuccess} = useQuery('searchPrvTypes', PrvRequests.getPrvTypes, {refetchOnWindowFocus: false});
    
    useEffect(() => {
        if (isLoading) {
            dispatch(privilegeActions.searchPrivilegesPending());
        }
        if (isSuccess) {
            dispatch(privilegeActions.searchPrivilegesFulfilled(data));
        }
        if (isError) {
            dispatch(privilegeActions.searchPrivilegesFailed(error));
            console.log('error = ', error);
        }
    }, [isLoading, isSuccess, isError, data, error, dispatch]);

    const {privileges} = useSelector((state) => state.privilege)
    const onTypeCodesChange = typeCodes=>
    {
        dispatch(privilegeActions.typeCodesChanged(typeCodes))
    }
    const onPageChange = page=>
    {
        dispatch(privilegeActions.pageChanged(page))
    }
    const onSizeChange = size=>
    {
        dispatch(privilegeActions.sizeChanged(size))
        dispatch(privilegeActions.pageChanged(0))
    }
    const onKeyChange = (key)=>
    {
        dispatch(privilegeActions.keyChanged(key))
        dispatch(privilegeActions.pageChanged(0))
    }
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <OutlinedInput value={key}
                                       onChange={(e)=>onKeyChange(e.target.value)}
                            id="input-search-list-style1"
                            placeholder="Search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="16px" />
                                </InputAdornment>
                            }
                            size="small"
                        />
                    </Grid>
                    {optionSuccess &&  <Grid item>
                        <Autocomplete sx={{minWidth: '200px'}} size={"small"}
                                      onChange={(e, values) => {
                                          onTypeCodesChange(values.map(v=>v.id))
                                      }}
                                      multiple
                                      options={options}
                                      getOptionLabel={(option) => option?.label}
                                      renderInput={(params) => <TextField {...params} label = 'Filtrer par type'/>}/>
                    </Grid>}
                    <Grid item>
                        <Typography variant="h3">
                            <NewPrivilegeForm />
                        </Typography>
                    </Grid>

                </Grid>
            }
            content={false}
        >
            {isSuccess && <PrivilegeList />}
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        {isSuccess && <Pagination page={page + 1} onChange={(e, page) => onPageChange(page - 1)}
                                     count={privileges.totalPages} color="primary"/>}
                    </Grid>
                    <Grid item>
                        <Button
                            size="large"
                            sx={{ color: theme.palette.grey[900] }}
                            color="secondary"
                            endIcon={<ExpandMoreRoundedIcon />}
                            onClick={handleClick}
                        >
                            10 Rows
                        </Button>
                        {anchorEl && (
                            <Menu
                                id="menu-user-list-style1"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                variant="selectedMenu"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                            >
                                <MenuItem onClick={()=>onSizeChange(5)}> 5 Rows</MenuItem>
                                <MenuItem onClick={()=>onSizeChange(10)}> 10 Rows</MenuItem>
                                <MenuItem onClick={()=>onSizeChange(20)}> 20 Rows</MenuItem>
                                <MenuItem onClick={()=>onSizeChange(30)}> 30 Rows </MenuItem>
                            </Menu>)}
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default PrivilegeListIndex;
