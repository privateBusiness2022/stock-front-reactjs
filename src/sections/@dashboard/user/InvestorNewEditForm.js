import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import moment from 'moment';
// utils
import axios from '../../../utils/axios';
import { useDispatch, useSelector } from '../../../redux/store';
import { getAll } from '../../../redux/slices/investor';
import { getAll as getUsers } from '../../../redux/slices/users';
import { getAll as getPeriods } from '../../../redux/slices/periods';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSelect, RHFTextField, RHFDatePiker } from '../../../components/hook-form';
import useLocales from '../../../hooks/useLocales';
import { BookingWidgetSummary } from '../general/booking';
import { DocIllustration } from '../../../assets';

// ----------------------------------------------------------------------

InvestorNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default function InvestorNewEditForm({ isEdit }) {
  const { translate } = useLocales();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);

  const id = parseInt(queryParams.get('id'), 10);

  const { investors } = useSelector((state) => state.investors);
  const { users } = useSelector((state) => state.users);
  const { periods } = useSelector((state) => state.periods);

  const currentInvestor = investors.find((investor) => investor.id === id);

  const { enqueueSnackbar } = useSnackbar();

  const NewInvestorSchema = !isEdit
    ? Yup.object().shape({
        name: Yup.string().required(translate('Name-is-required')),
        phone: Yup.string().required(translate('Phone-is-required')),
        account: Yup.string().required(translate('Account-is-required')),
        stocksPrice: Yup.number().required(translate('Stocks-Price-is-required')),
        period: Yup.number().required(translate('Period-is-required')),
        reference: Yup.string().required(translate('Reference-is-required')),
      })
    : Yup.object().shape({
        name: Yup.string().required(translate('Name-is-required')),
        phone: Yup.string().required(translate('Phone-is-required')),
        account: Yup.string().required(translate('Account-is-required')),
      });

  const defaultValues = useMemo(
    () => ({
      name: currentInvestor?.name || '',
      phone: currentInvestor?.phone || '',
      account: currentInvestor?.account || '',
      stocksPrice: currentInvestor?.stocks[0]?.price || 0,
      period: currentInvestor?.period?.name || '',
      reference: currentInvestor?.reference.name || '',
    }),
    [currentInvestor]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvestorSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (isEdit && currentInvestor) {
      delete data.period;
      delete data.reference;
      delete data.stocksPrice;
      try {
        const response = await axios.put(
          `/clients/requests-to-update/${window.localStorage.getItem('id')}/${currentInvestor.id}`,
          data
        );
        if (response.status === 200) {
          dispatch(getAll());
          enqueueSnackbar(!isEdit ? translate('Create-success!') : translate('Update-success!'));
          reset();
          navigate(PATH_DASHBOARD.investor.list);
        } else {
          enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(translate(error.message), { variant: 'error' });
        // console.error(error);
      }
    }
    if (!isEdit) {
      try {
        const response = await axios.post('/clients', data);
        if (response.status === 201) {
          dispatch(getAll());
          enqueueSnackbar(!isEdit ? translate('Create-success!') : translate('Update-success!'));
          reset();
          navigate(PATH_DASHBOARD.investor.list);
        } else {
          enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(translate(error.message), { variant: 'error' });
        // console.error(error);
      }
    }
  };

  const onStockWithdrawal = async () => {
    try {
      const response = await axios.post(`/clients/stocks-withdrawal/${currentInvestor.id}`);
      if (response.status === 201) {
        dispatch(getAll());
        enqueueSnackbar(translate('Stock-withdrawal-request-success!'));
        reset();
        navigate(PATH_DASHBOARD.investor.list);
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      if (error.statusCode === 409) {
        enqueueSnackbar(translate(error.message), { variant: 'error' });
      }
      // console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getPeriods());
  }, [dispatch]);

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
              <RHFTextField name="phone" label={translate('Phone-Number')} />
              <RHFTextField name="account" label={translate('Account-Number')} />
              {!isEdit ? <RHFTextField name="stocksPrice" type="number" label={translate('Stocks-Price')} /> : null}
              {!isEdit ? (
                <RHFSelect name="period" defaultValue="1" label={translate('Period')}>
                  <option selected value="1">
                    {translate('Select-Period')}
                  </option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
                </RHFSelect>
              ) : null}
              {!isEdit ? (
                <RHFSelect name="reference" defaultValue="1" label={translate('Reference')}>
                  <option selected value="1">
                    {translate('Select-Reference')}
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </RHFSelect>
              ) : null}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('Create-Investor') : translate('Save-Changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
        {isEdit ? (
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField disabled name="period" label={translate('Period')} />
                <RHFTextField disabled name="stocksPrice" type="number" label={translate('Stocks-Price')} />
                <RHFTextField disabled name="reference" label={translate('Reference')} />
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="button"
                  variant="contained"
                  color="error"
                  loading={isSubmitting}
                  onClick={onStockWithdrawal}
                >
                  {translate('Stock-withdrawal')}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </FormProvider>
  );
}
