import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import {Autocomplete, Button, Dialog, FormHelperText, Grid, IconButton, TextField} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';

// assets
import CloseIcon from '@mui/icons-material/Close';
import {FormMode} from "../../../../enums/FormMode";
import {gridSpacing} from "../../../../store/constant";
import InputLabel from "../../../../ui-component/extended/Form/InputLabel";
import AlertDialog from "../../../ui-elements/advance/UIDialog/AlertDialog";
import * as Yup from "yup";
import {useMutation, useQueryClient} from "react-query";
import {Request} from "../../../../utils/axios";
import {useFormik} from "formik";
import {dispatch} from "../../../../store";
import {useSelector} from "react-redux";
import {privilegeActions} from "../../../../store/slices/administration/security/privilegeSlice";
import FloatingAlert from "../../../ui-elements/custom/FloatingAlert";
import {useFeedBackEffects} from "../../../../hooks/useFeedBack";

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

export default function PrivilegeForm() {
    const initialPrv = {privilegeCode: '',privilegeName: '', typeCode: ''};
    const {formOpened, currentPrv, formMode} = useSelector(state => state.privilege);
    const [options, setOptions] = useState([])

    const handleClickOpen = () => {
        dispatch(privilegeActions.formOpened({currentPrv: initialPrv, formMode: FormMode.NEW}))
    };

    const handleClose = () => {
        dispatch(privilegeActions.formClosed())
        formik.setTouched({privilegeCode: false, privilegeName: false, typeCode: false});
    };

    const prvCodeIsUnique = async(prvCode)=>
    {
        let isUnique = false;
        await Request({url: `/privileges/existsByCode/${prvCode}`}).then(resp=> { isUnique = !resp.data})
        return isUnique;
    }

    const existingPrvCode = async(prvCode)=>
    {
        let existing = false;
        await Request({url: `/privileges/existsByCode/${prvCode}`}).then(resp=> { existing = resp.data})
        return existing;
    }

    const prvNameIsUnique = async (prvName, prvCode) =>
    {
        prvCode = prvCode == undefined ||prvCode == null ? "" : prvCode;
        let isUnique = false;
        await Request({url: `/privileges/existsByName/${prvName}?privilegeCode=${prvCode}`}).then(resp=> { isUnique = !resp.data})
        return isUnique;
    }

    const prvTypeCodeIsValid = async (typeCode)=>
    {
        let isValid = false;
        await Request({url: `/privileges/type-is-valid/${typeCode}`})
            .then(resp=>isValid = resp.data).catch(err=>console.log(err))
        return isValid;
    }

    const validationSchema = Yup.object(
    {
        privilegeCode: Yup.string().required('Veuillez saisir le code du privilège')
            .test('uniquePrivilegeCode', 'Code déjà utilisé', function(prvCode)
            {
                if(formMode == FormMode.UPDATE) return true;
                return prvCodeIsUnique(prvCode);
            }).test('existingPrvCode', 'Veuillez selectionner le privilège à modifier', function(prvCode)
            {
                if(formMode == FormMode.NEW) return true;
                const existing = existingPrvCode(prvCode);
                return existing;
            }),

        privilegeName: Yup.string().required('Veuillez saisir le nom du privilège')
            .test('uniquePrvName', 'Nom de privilège déjà utilisé', function(prvName)
            {
                const {privilegeCode} = this.parent
                const isUnique = prvNameIsUnique(prvName, privilegeCode);
                return isUnique;
            }),
        typeCode: Yup.string().required('Veuillez sélectionner le type du privilège')
            .test('validTypeCode', 'Type de code invalide', value=>prvTypeCodeIsValid(value))});

    const queryClient = useQueryClient();
    const {mutate: createPrv, error: createError, isError: isCreateError, isSuccess: isCreateSuccess} = useMutation('savePrv',
        (data)=>Request({method: 'post', url: `/privileges/create`, data: data}),
        {onSuccess: ()=>queryClient.invalidateQueries("searchPrivileges")})

    const {mutate: updatePrv, error: updateError, isError: isUpdateError, isSuccess: isUpdateSuccess} = useMutation('updatePrv', (data)=>Request({method: 'put', url: `/privileges/update`, data: data}))

    const handleSubmit = values =>
    {
        formMode == FormMode.NEW ? createPrv(values) : formMode == FormMode.UPDATE ? updatePrv(values) : null
    }


    const formik = useFormik({
        initialValues: currentPrv,
        onSubmit: handleSubmit,
        validationSchema: validationSchema,
    })

    const handleConfirmation = async()=>
    {
        if(!formik.isValid) return;
        formik.submitForm();
    }
    useEffect(() => {
        formik.setValues(currentPrv);
        formik.setFieldValue("typeCode",  currentPrv.typeCode);
    }, [currentPrv]);

    useFeedBackEffects(isCreateSuccess, isCreateError, createError, isUpdateSuccess, isUpdateError, updateError);
    useEffect(() => {
        if(isCreateSuccess || isUpdateSuccess)
        {
            dispatch(privilegeActions.formClosed());
        }
    }, [isCreateSuccess, isUpdateSuccess]);

    useEffect(() => {
        Request({url: "/privileges/types"}).then(resp=>setOptions(resp.data)).catch(err=>console.log(err))

    }, []);

    return (
        <div>
            <Button variant="contained" color={'secondary'} onClick={handleClickOpen} title={'Ajouter un nouveau privilège'}>
                <AddIcon />
            </Button>
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={formOpened}>
                <form onSubmit={formik.handleSubmit}>
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {formMode == FormMode.NEW ? 'Nouveau privilège' : 'Modification du privilège ' + currentPrv.privilegeCode}

                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} lg={6}>
                                        <InputLabel>Code privilège {formik.touched.privilegeCode&&<small style={{color:'red'}} >{formik.errors.privilegeCode}</small>}</InputLabel>
                                        <TextField InputProps={{ readOnly: formMode==FormMode.UPDATE }} fullWidth onBlur={formik.handleBlur} name={'privilegeCode'} value={formik.values.privilegeCode} placeholder="Saisir le code du privilège" size={"small"} onChange={formik.handleChange}/>

                                    </Grid>
                                    <Grid item xs={12} lg={6}>
                                        <InputLabel>Nom {formik.touched.privilegeName&&<small style={{color:'red'}} >{formik.errors.privilegeName}</small>}</InputLabel>
                                        <TextField fullWidth placeholder="Saisir le nom du privilège" onBlur={formik.handleBlur} size={"small"} name={'privilegeName'} value={formik.values.privilegeName} onChange={formik.handleChange}/>
                                        <FormHelperText></FormHelperText>
                                    </Grid>
                                    <Grid item xs={12} lg={12}>
                                        <InputLabel>Type de privilège {formik.errors.typeCode && (
                                            <small style={{ color: 'red' }}>{formik.errors.typeCode}</small>
                                        )}</InputLabel>
                                        <Autocomplete
                                            fullWidth
                                            size={"small"}
                                            name={'typeCode'}
                                            onChange={(e, o) => {
                                                formik.setFieldValue("typeCode", o.id);
                                            }}
                                            getOptionValue={(option) => option.id}
                                            onBlur={(e) => {
                                                formik.handleBlur(e);  // Make sure to call the Formik handler
                                            }}
                                            value={{label:formik.values.typeCode}}
                                            options={options}
                                            renderInput={(params) => <TextField {...params} label='Sélectionner le type' />}
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
