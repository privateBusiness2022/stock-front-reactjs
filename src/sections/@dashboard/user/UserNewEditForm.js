import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// utils
import axios from '../../../utils/axios';
import { useDispatch, useSelector } from '../../../redux/store';
import { getAll } from '../../../redux/slices/users';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default function UserNewEditForm({ isEdit }) {
  const { translate } = useLocales();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);

  const id = parseInt(queryParams.get('id'), 10);

  const { users } = useSelector((state) => state.users);

  const currentUser = users.find((user) => user.id === id);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = !isEdit
    ? Yup.object().shape({
        name: Yup.string().required(translate('Name-is-required')),
        email: Yup.string().required(translate('Email-is-required')).email(),
        phone: Yup.string().required(translate('Phone-is-required')),
        password: Yup.string().required(translate('Password-is-required')),
        confirmPassword: Yup.string()
          .required(translate('password-confirmation-is-required'))
          .oneOf([Yup.ref('password'), null], translate('password-confirmation-must-match')),
        role: Yup.string().required(translate('Role-is-required')),
      })
    : Yup.object().shape({
        name: Yup.string().required(translate('Name-is-required')),
        email: Yup.string().required(translate('Email-is-required')).email(),
        phone: Yup.string().required(translate('Phone-is-required')),
        role: Yup.string().required(translate('Role-is-required')),
      });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      password: currentUser?.password || '',
      confirmPassword: currentUser?.password || '',
      role: currentUser?.role || '',
    }),
    [currentUser]
  );

  const ROLE_OPTIONS = [
    { value: 'SUDO', label: 'SUDO' },
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'ACCOUNTER', label: 'ACCOUNTER' },
    { value: 'AGENT', label: 'AGENT' },
  ];

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (isEdit && currentUser) {
      delete data.password;
      delete data.confirmPassword;
      try {
        const response = await axios.patch(`/users/${id}`, data);
        if (response.status === 200) {
          dispatch(getAll());
          enqueueSnackbar(!isEdit ? translate('Create-success!') : translate('Update-success!'));
          reset();
          navigate(PATH_DASHBOARD.user.list);
        } else {
          enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (!isEdit) {
      delete data.confirmPassword;
      try {
        const response = await axios.post('/users', data);
        if (response.status === 201) {
          dispatch(getAll());
          enqueueSnackbar(!isEdit ? translate('Create-success!') : translate('Update-success!'));
          reset();
          navigate(PATH_DASHBOARD.user.list);
        } else {
          enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(translate('409001: User with this email already exists'), { variant: 'error' });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label={translate('Full-Name')} />
              <RHFTextField name="email" label={translate('Email-Address')} />
              <RHFTextField name="phone" label={translate('Phone-Number')} />

              <RHFSelect name="role" label={translate('role')} placeholder={translate('role')}>
                <option value="" />
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {translate(option.label)}
                  </option>
                ))}
              </RHFSelect>

              {!isEdit ? <RHFTextField name="password" label={translate('Password')} /> : null}
              {!isEdit ? <RHFTextField name="confirmPassword" label={translate('Confirm-Password')} /> : null}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('Create-User') : translate('Save-Changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
