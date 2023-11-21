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
    Tooltip,
} from '@mui/material';

// project imports

import { useDispatch, useSelector } from 'store';
//import { getUsersListStyle1 } from 'store/slices/user';

// assets
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import {searchTypes, typeActions} from "../../../../store/slices/administration/params/typeSlice";
import {FormMode} from "../../../../enums/FormMode";
import {Edit} from "@mui/icons-material";

//const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const TypeList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    //const [data, setData] = React.useState([]);
    const { types } = useSelector((state) => state.type);


    React.useEffect(() => {
        dispatch(searchTypes());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Nom du type</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell>Groupe</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {types &&
                    types?.content?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
                                <TableCell>
                                    {row.uniqueCode}
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.typeGroup}</TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Modifier">
                                            <IconButton color="primary" aria-label="delete" size="large" onClick={()=>{dispatch(typeActions.typeFormOpened({currentType: {...row, oldUniqueCode: row.uniqueCode}, formMode: FormMode.UPDATE}))}} >
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

export default TypeList;
