import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../../redux/store';

// utils
import axios from '../../../../utils/axios';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import useLocales from '../../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { getAll } from '../../../../redux/slices/users';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let id = window.localStorage.getItem('id');

  id = parseInt(id, 10);

  const { users } = useSelector((state) => state.users);

  const currentUser = users.find((user) => user.id === id);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required(translate('Name-is-required')),
    email: Yup.string().required(translate('Email-is-required')).email(),
    phone: Yup.string().required(translate('Phone-is-required')),
  });

  const defaultValues = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(`/users/${id}`, data);
      if (response.status === 200) {
        enqueueSnackbar(translate('Update-success!'));
        reset();
        navigate(PATH_DASHBOARD.user.list);
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
    }
  };

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label={translate('Full-Name')} />
              <RHFTextField name="email" label={translate('Email-Address')} />
              <RHFTextField name="phone" label={translate('Phone-Number')} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {translate('Save-Changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
