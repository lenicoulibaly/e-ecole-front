import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import {
    Autocomplete,
    Button,
    Dialog,
    FormHelperText,
    Grid,
    IconButton,
    TextField
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';

// assets
import CloseIcon from '@mui/icons-material/Close';
import {gridSpacing} from "../../../../store/constant";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import {Request} from "../../../../utils/axios";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useMutation} from "react-query";
import {useSelector} from "react-redux";
import {dispatch} from "../../../../store";
import {typeActions} from "../../../../store/slices/administration/params/typeSlice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuDialogActions-root': {
        padding: theme.spacing(1)
    }
}));

const BootstrapDialogTitle = ({ children, onClose, ...other }) => (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: (theme) => theme.palette.grey[500]
                }}
            >
                <CloseIcon />
            </IconButton>
        ) : null}
    </DialogTitle>
);

BootstrapDialogTitle.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default function NewTypeForm() {
    const {formOpened, currentType} = useSelector(state => state.type);
    //const [open, setOpen] = React.useState(false);
    const [options, setOptions] = useState([])

    const handleClickOpen = () => {
        dispatch(typeActions.typeFormOpened(currentType))
    };
    const handleClose = () => {
        dispatch(typeActions.typeFormClosed())
    };


     const typeCodeIsUnique = async(typeCode)=>
    {
        let isUnique = false;
        await Request({url: `/types/exists-by-uniqueCode/${typeCode}`}).then(resp=> { isUnique = !resp.data})
        return isUnique;
    }

    const typeNameIsUnique = async (typeName, uniqueCode) =>
    {
        let isUnique = false;
        await Request({url: `/types/exists-by-name?name=${typeName}&uniqueCodde=${uniqueCode}`}).then(resp=> { isUnique = !resp.data})
        return isUnique;
    }

    const typeGroupIsValid = async (typeGroup)=>
    {
        let isValid = false;
        await Request({url: `/types/type-group-is-valid/${typeGroup}`})
            .then(resp=>isValid = resp.data).catch(err=>console.log(err))
        return isValid;
    }

    const validationSchema = Yup.object(
        {
            uniqueCode: Yup.string().required('Veuillez saisir le code du type')
                .test('uniqueTypeCode', 'Code déjà utilisé', function(typeCode)
                {
                    const isUnique = typeCodeIsUnique(typeCode);
                    return isUnique;
                }),
            name: Yup.string().required('Veuillez saisir le nom du type')
                .test('uniqueTypeName', 'Nom de type déjà utilisé', function(typeName)
                {
                    const {uniqueCode} = this.parent
                    const isUnique = typeNameIsUnique(typeName, uniqueCode);
                    return isUnique;
                }),
            typeGroup: Yup.string().required('Veuillez sélectionner le groupe du type')
                .test('validTypeGroup', 'Groupe invalide', value=>typeGroupIsValid(value))});

     const {mutate} = useMutation('saveType', (data)=>Request({method: 'post', url: `/types/create`, data: data}))



    const formik = useFormik({
        initialValues: currentType,
        onSubmit: values => mutate(values),
        validationSchema: validationSchema,
    })
    useEffect(() => {
        formik.setValues(currentType);
    }, [currentType]);

    useEffect(() => {
        Request({url: "/types/type-groups"}).then(resp=>setOptions(resp.data)).catch(err=>console.log(err))
    }, []);

    return (
        <div>
            <Button variant="contained" color={"secondary"} onClick={handleClickOpen} title={"Ajouter un nouveau type"}>
                <AddIcon />
            </Button>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={formOpened}  maxWidth="sm" fullWidth>
                <form onSubmit={formik.handleSubmit}>
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Nouveau type
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} lg={6}>
                                            <InputLabel>Code unique  <small style={{color:'red'}} >{formik.errors.uniqueCode}</small></InputLabel>
                                            <TextField fullWidth name={'uniqueCode'} value={formik.values.uniqueCode} placeholder="Saisir le code du type" size={"small"} onChange={formik.handleChange}/>

                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <InputLabel>Nom <small style={{color:'red'}} >{formik.errors.name}</small></InputLabel>
                                            <TextField fullWidth placeholder="Saisir le nom du type" size={"small"} name={'name'} value={formik.values.name} onChange={formik.handleChange}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} lg={12}>
                                            <InputLabel>Groupe <small style={{color:'red'}} >{formik.errors.typeGroup}</small></InputLabel>
                                            <Autocomplete fullWidth  size={"small"} name={'typeGroup'} onChange={(e, o)=>formik.setFieldValue("typeGroup", o.id)} onBlur={formik.handleBlur}
                                                          options={options}
                                                          getOptionLabel={(option) => option?.label}
                                                          renderInput={(params) => <TextField {...params} label = 'Selectioner le groupe'/>}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                    </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus type={"submit"}>
                            Enregistrer
                        </Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
        </div>
    );
}
