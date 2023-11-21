import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {TextField} from "@mui/material";
import {useEffect} from "react";
import {transferListActions} from "../../../store/slices/transferListSlice";
import {dispatch} from "../../../store";

function not(a, b) {
    return a?.filter((value) => b?.indexOf(value) === -1);
}

function intersection(a, b) {
    return a?.filter((value) => b?.indexOf(value) !== -1);
}

export default function TransferList({unselected, preselected=[]}) {
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(unselected);
    const [right, setRight] = React.useState([]);

    useEffect(()=>
    {
        setRight(preselected)
    }, [])

    useEffect(()=>
    {
        dispatch(transferListActions.selectionChanged(right))
    }, [right])

    useEffect(()=>
    {
        const rightIds = right?.map(r=>r?.id);
        setLeft(right == null || right == undefined || right.length == 0 ? unselected : unselected?.filter(u=>rightIds?.indexOf(u?.id) == -1))
    }, [unselected, right])

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right?.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right?.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };
    const isPreselected = (item)=>
    {
        const preselectedIds = preselected?.map(i=>i?.id);
        const selected = preselectedIds?.indexOf(item?.id) >=0
        return selected;
    }

    const preselectedStyle = {backgroundColor: 'green', fontWeight: 'bolder', color: 'white'}
    const customList = (items) => (
        <Paper sx={{ width: 300, height: 230, overflow: 'auto' }}>
            <TextField size={"small"} fullWidth />
            <List dense component="div" role="list">
                {items?.map((value) => {
                    const labelId = value?.label;
                    return (
                        <ListItem
                            key={value?.id}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                            style={isPreselected(value) ? preselectedStyle : {}}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value?.label} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{customList(left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left?.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked?.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right?.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList(right)}</Grid>
        </Grid>
    );
}
