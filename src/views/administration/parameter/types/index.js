import React, {useEffect, useState} from 'react';

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
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assetsf
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {dispatch, store, useSelector} from "../../../../store";
import {searchTypes, typeActions} from "../../../../store/slices/administration/params/typeSlice";
import TypeList from "./TypeList";
import NewTypeForm from "./NewTypeForm";
import {Request} from "../../../../utils/axios";

// ==============================|| USER LIST STYLE 1 ||============================== //

const ListStylePage1 = () => {
    const typeKey = useSelector((state) => state.type.typeKey)
    const typePages = useSelector(state=>state.type.types)
    const [options, setOptions] = useState([])
    const onTypeGroupsChange = async (values)=>
    {
        await dispatch(typeActions.typeGroupsChanged(values))
        dispatch(typeActions.typePageChanged(0))
        dispatch(searchTypes());
    }

    const onPageChange = (page)=>
    {
        dispatch(typeActions.typePageChanged(page-1))
        dispatch(searchTypes());
    }

    useEffect(() => {
        Request({url: "/types/type-groups"}).then(resp=>setOptions(resp.data)).catch(err=>console.log(err))
    }, []);
    const onTypeKeyChange = async (key)=>
    {
        await dispatch(typeActions.typeKeyChanged(key))
        dispatch(typeActions.typePageChanged(0))
        dispatch(searchTypes());
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
                        <OutlinedInput value={typeKey}
                                       onChange={(e)=>onTypeKeyChange(e.target.value)}
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
                    <Grid item >
                        <Autocomplete sx={{ minWidth: '200px' }}  size={"small"}
                                      onChange={(e, values)=>{onTypeGroupsChange(values)}}
                            multiple
                            options={options}
                            getOptionLabel={(option) => option?.label}
                            renderInput={(params) => <TextField {...params} label={'Filtrer par groupe'}/>}/>
                    </Grid>
                    <Grid item>
                        <Typography variant="h3">
                            <NewTypeForm />
                        </Typography>
                    </Grid>

                </Grid>
            }
            content={false}
        >
            <TypeList />
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Pagination page={store.getState().type.typePage+1} onChange={(e, page)=>onPageChange(page)} count={typePages?.totalPages} color="primary" />
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
                                <MenuItem onClick={handleClose}> 10 Rows</MenuItem>
                                <MenuItem onClick={handleClose}> 20 Rows</MenuItem>
                                <MenuItem onClick={handleClose}> 30 Rows </MenuItem>
                            </Menu>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ListStylePage1;
