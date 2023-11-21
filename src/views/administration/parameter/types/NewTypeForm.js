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
import {FormMode} from "../../../../enums/FormMode";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import {feedBackActions} from "../../../../store/slices/feedBackSlice";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";

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
    const {formOpened, currentType, formMode} = useSelector(state => state.type);
    const [options, setOptions] = useState([])
    const [selected, setSelected] = useState(null);

    const handleClickOpen = () => {
        dispatch(typeActions.typeFormOpened({currentType: {}, formMode: FormMode.NEW}))
    };
    const handleClose = () => {
        dispatch(typeActions.typeFormClosed())
        formik.setTouched({uniqueCode: false, name: false, typeGroup: false});
        //alert(formik.errors.uniqueCode)
    };

    const typeCodeIsUnique = async(typeCode, oldUniqueCode)=>
    {
        let isUnique = false;
        await Request({url: `/types/exists-by-uniqueCode/${typeCode}?oldUniqueCode=${oldUniqueCode}`}).then(resp=> { isUnique = !resp.data})
        return isUnique;
    }

    const existingTypeCode = async(oldUniqueCode)=>
    {
        let existing = false;
        await Request({url: `/types/exists-by-uniqueCode/${oldUniqueCode}`}).then(resp=> { existing = resp.data})
        return existing;
    }

    const typeNameIsUnique = async (typeName, uniqueCode) =>
    {
        let isUnique = false;
        await Request({url: `/types/exists-by-name?name=${typeName}&uniqueCode=${uniqueCode}`}).then(resp=> { isUnique = !resp.data})
        return isUnique;
    }

    const typeGroupIsValid = async (typeGroup)=>
    {
        let isValid = false;
        await Request({url: `/types/type-group-is-valid/${typeGroup}`})
            .then(resp=>isValid = resp.data).catch(err=>console.log(err))
        return isValid;
    }

    const validationSchema = Yup.object({
            uniqueCode: Yup.string().required('Veuillez saisir le code du type')
                .test('uniqueTypeCode', 'Code déjà utilisé', function(typeCode)
                {
                    if(formMode == FormMode.UPDATE)
                    {
                        const {oldUniqueCode} = this.parent
                        return typeCodeIsUnique(typeCode, oldUniqueCode);
                    }
                    return typeCodeIsUnique(typeCode, "");
                }).test('existingTypeCode', 'Veuillez selectionner le type à modifier', function()
                {
                    if(formMode == FormMode.NEW) return true;
                    const {oldUniqueCode} = this.parent
                    const isUnique = existingTypeCode(oldUniqueCode);
                    return isUnique;
                }),

            name: Yup.string().required('Veuillez saisir le nom du type')
                .test('uniqueTypeName', 'Nom de type déjà utilisé', function(typeName)
                {
                    const {oldUniqueCode} = this.parent
                    const isUnique = typeNameIsUnique(typeName, oldUniqueCode);
                    return isUnique;
                }),
            typeGroup: Yup.string().required('Veuillez sélectionner le groupe du type')
                .test('validTypeGroup', 'Groupe invalide', value=>typeGroupIsValid(value))});
    const {mutate: createType, error: createError, isSuccess: isCreateSuccess, isError: isCreateError} = useMutation('saveType',
        (data)=>Request({method: 'post', url: `/types/create`, data: data}))

    const {mutate: updateType, error: updateError, isSuccess: isUpdateSuccess, isError: isUpdateError} = useMutation('updateType', (data)=>Request({method: 'put', url: `/types/update`, data: data}))

    const handleSubmit = values => {
        console.log("values ", values)
        formMode == FormMode.NEW ? createType(values) : formMode == FormMode.UPDATE ? updateType(values) : null
    }


    const formik = useFormik({
        initialValues: currentType,
        onSubmit: handleSubmit,
        validationSchema: validationSchema,
    })

    const handleConfirmation = async()=>
    {
        if(!formik.isValid) return;
        formik.submitForm();
    }
    useEffect(() => {
        formik.setValues(currentType);
        setSelected(options.find(o => o.id === currentType.typeGroup));
    }, [currentType]);

    useEffect(() => {
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
            dispatch(feedBackActions.operationSuccessful("Opération réalisée avec succès"))
        }
    }, [updateError, createError, isCreateSuccess, isUpdateSuccess]);

    useEffect(() => {
        Request({url: "/types/type-groups"}).then(resp=>setOptions(resp.data)).catch(err=>console.log(err))

    }, []);

    return (
        <div>
            <Button variant="contained" color={"secondary"} onClick={handleClickOpen} title={"Ajouter un nouveau type"}>
                <AddIcon />
            </Button>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={formOpened} maxWidth="sm" fullWidth>
                <form onSubmit={formik.handleSubmit}>
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {formMode == FormMode.NEW ? 'Nouveau type' : 'Modification du type ' + currentType.oldUniqueCode}

                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} lg={6}>
                                            <InputLabel>Code unique {formik.touched.uniqueCode&&<small style={{color:'red'}} >{formik.errors.uniqueCode}</small>}</InputLabel>
                                            <TextField InputProps={{ readOnly: formMode==FormMode.UPDATE }} fullWidth onBlur={formik.handleBlur} name={'uniqueCode'} value={formik.values.uniqueCode} placeholder="Saisir le code du type" size={"small"} onChange={formik.handleChange}/>

                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <InputLabel>Nom {formik.touched.name&&<small style={{color:'red'}} >{formik.errors.name}</small>}</InputLabel>
                                            <TextField fullWidth placeholder="Saisir le nom du type" onBlur={formik.handleBlur} size={"small"} name={'name'} value={formik.values.name} onChange={formik.handleChange}/>
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} lg={12}>
                                            <InputLabel>Groupe {formik.errors.typeGroup && (
                                                <small style={{ color: 'red' }}>{formik.errors.typeGroup}</small>
                                            )}</InputLabel>
                                            <Autocomplete
                                                fullWidth
                                                size={"small"}
                                                name={'typeGroup'}
                                                onChange={(e, o) => {
                                                    setSelected(options.find(op => op.id === o.id));
                                                    formik.setFieldValue("typeGroup", o.id);
                                                }}
                                                getOptionValue={(option) => option.id}
                                                onBlur={(e) => {
                                                    formik.handleBlur(e);  // Make sure to call the Formik handler
                                                }}
                                                value={selected}
                                                options={options}
                                                getOptionLabel={(option) => option?.label}
                                                renderInput={(params) => <TextField {...params} label='Sélectionner le groupe' />}
                                            />
                                            <FormHelperText></FormHelperText>
                                        </Grid>
                                    </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <AlertDialog actionDisabled={!formik.isValid} openLabel={'Enregistrer'} handleConfirmation={handleConfirmation}/>

                    </DialogActions>
                </form>
            </BootstrapDialog>

            <FloatingAlert />

        </div>
    );
}
