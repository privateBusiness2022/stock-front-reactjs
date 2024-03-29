import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// utils
import { getAll } from '../../../redux/slices/periods';
import { useDispatch, useSelector } from '../../../redux/store';
import axios from '../../../utils/axios';
// routes
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

ProjectNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default function ProjectNewEditForm({ isEdit }) {
  const { translate } = useLocales();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);

  const id = parseInt(queryParams.get('id'), 10);

  const { periods } = useSelector((state) => state.periods);

  const { projects } = useSelector((state) => state.projects);

  const periodsFund = [];

  const currentProject = projects.find((project) => project.id === id);

  const { enqueueSnackbar } = useSnackbar();

  const formData = [
    {
      id: 'name',
      validationType: 'string',
      validations: [
        {
          type: 'required',
          params: [translate('Name-is-required')],
        },
      ],
    },
  ];

  for (let i = 0; i < periods.length; i += 1) {
    formData.push({
      id: `periodFund${periods[i].id}`,
      validationType: 'number',
      validations: [
        {
          type: 'optional',
          params: [translate('Stocks-is-required')],
        },
      ],
    });
  }

  const yepSchema = formData.reduce(createYupSchema, {});
  const validateSchema = Yup.object().shape(yepSchema);

  const defaultValues = useMemo(
    () => ({
      name: currentProject?.name || '',
    }),
    [currentProject]
  );

  const methods = useForm({
    resolver: yupResolver(validateSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (isEdit && currentProject) {
      try {
        const response = await axios.patch(`/projects/${id}`, data);
        if (response.status === 200) {
          enqueueSnackbar(!isEdit ? translate('Create-success!') : translate('Update-success!'));
          reset();
          navigate(PATH_DASHBOARD.project.list);
        } else {
          enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (!isEdit) {
      periods.forEach((period) => {
        periodsFund.push({
          periodId: period.id,
          fund: data[`periodFund${period.id}`],
        });
        delete data[`periodFund${period.id}`];
      });
      data.periodsFund = periodsFund;

      try {
        const response = await axios.post(`/projects`, data);
        if (response.status === 201) {
          enqueueSnackbar(!isEdit ? translate('Create-success!') : translate('Update-success!'));
          reset();
          navigate(PATH_DASHBOARD.project.list);
        } else {
          enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(translate(error.message), { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  function handleAgentChange(e, id) {
    periodsFund.push({ periodId: id, fund: e.target.value });
  }

  function createYupSchema(schema, config) {
    const { id, validationType, validations = [] } = config;
    if (!Yup[validationType]) {
      return schema;
    }
    let validator = Yup[validationType]();
    validations.forEach((validation) => {
      const { params, type } = validation;
      if (!validator[type]) {
        return;
      }
      validator = validator[type](...params);
    });
    schema[id] = validator;
    return schema;
  }

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
              {/* <RHFDatePiker name="end" label={translate('End-date')} /> */}
              {isEdit
                ? null
                : periods?.map((period) => (
                    <RHFTextField
                      key={period.id}
                      name={`periodFund${period.id}`}
                      type="number"
                      label={`${translate('Period-Fund')}  ${period.name}`}
                    />
                  ))}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('Create-Project') : translate('Save-Changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
