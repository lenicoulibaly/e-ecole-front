import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {Button, Grid, InputAdornment, Menu, MenuItem, OutlinedInput, Pagination, Typography} from '@mui/material';

// project imports
import UserList from './UserList';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assetsf
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {dispatch, useSelector} from "../../../../../store";
import {searchUsers, userActions} from "../../../../../store/slices/administration/security/userSlice";
import CustomizedDialogs from "../../../../ui-elements/advance/UIDialog/CustomizedDialogs";

// ==============================|| USER LIST STYLE 1 ||============================== //

const ListStylePage1 = () => {
    const userKey = useSelector((state) => state.searchKey.userKey)
    const onUserKeyChange = async (key)=>
    {
        await dispatch(userActions.userKeyChanged(key))
        dispatch(searchUsers());
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
                        <OutlinedInput value={userKey}
                                       onChange={(e)=>onUserKeyChange(e.target.value)}
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
                    <Grid item>
                        <Typography variant="h3">
                            <CustomizedDialogs  />
                        </Typography>
                    </Grid>

                </Grid>
            }
            content={false}
        >
            <UserList />
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Pagination count={10} color="primary" />
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