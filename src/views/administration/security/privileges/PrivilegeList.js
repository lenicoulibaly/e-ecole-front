import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';

// project imports

import {dispatch, useSelector} from 'store';

// assets
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import {Edit} from "@mui/icons-material";
import {FormMode} from "../../../../enums/FormMode";
import {privilegeActions} from "../../../../store/slices/administration/security/privilegeSlice";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const PrivilegeList = () => {
    const theme = useTheme();

    //const [data, setData] = React.useState([]);
    const { privileges } = useSelector((state) => state.privilege);

    React.useEffect(() => {
        //dispatch(searchRoles());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickUpdate = (prv)=>
    {
        dispatch(privilegeActions.formOpened({currentPrv: {...prv}, formMode: FormMode.UPDATE}))
    }
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>Code du privilège</TableCell>
                        <TableCell>Nom du privilège</TableCell>
                        <TableCell>Type de privilège</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {privileges &&
                    privileges?.content?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index+1}</TableCell>
                                <TableCell>
                                    {row.privilegeCode}
                                </TableCell>
                                <TableCell>{row.privilegeName}</TableCell>
                                <TableCell>{row.prvTypeName}</TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Modifier">
                                            <IconButton color="primary" aria-label="delete" size="large" onClick={()=>handleClickUpdate(row)}>
                                                <Edit sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Block">
                                            <IconButton
                                                color="primary"
                                                sx={{
                                                    color: theme.palette.orange.dark,
                                                    borderColor: theme.palette.orange.main,
                                                    '&:hover ': { background: theme.palette.orange.light }
                                                }}
                                                size="large"
                                            >
                                                <BlockTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PrivilegeList;
