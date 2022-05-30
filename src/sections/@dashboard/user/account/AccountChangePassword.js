import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { useNavigate } from 'react-router-dom';
import axios from '../../../../utils/axios';

// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import useLocales from '../../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  let id = window.localStorage.getItem('id');

  id = parseInt(id, 10);

  const ChangePassWordSchema = Yup.object().shape({
    currentPassword: Yup.string().required(translate('change-password.Old-Password-is-required')),
    newPassword: Yup.string()
      .min(6, translate('change-password.Password-must-be-at-least-6-characters'))
      .required(translate('change-password.New-Password-is-required')),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      translate('password-confirmation-must-match')
    ),
  });

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      delete data.confirmNewPassword;
      const response = await axios.patch(`/users/${id}`, data);
      if (response.status === 200) {
        enqueueSnackbar(translate('Update-success!'));
        reset();
        navigate(PATH_DASHBOARD.root);
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="currentPassword" type="password" label={translate('change-password.Old-Password')} />

          <RHFTextField name="newPassword" type="password" label={translate('change-password.New-Password')} />

          <RHFTextField
            name="confirmNewPassword"
            type="password"
            label={translate('change-password.Confirm-Password')}
          />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {translate('Save-Changes')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
