import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { LocalizationProvider } from '@mui/lab';
import { TextField } from '@mui/material';
// Moment.js
import DateAdapter from '@mui/lab/AdapterMoment';

// ----------------------------------------------------------------------

RHFDatePiker.propTypes = {
  name: PropTypes.string,
};

export default function RHFDatePiker({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={DateAdapter}>
          <TextField type="date" {...field} fullWidth error={!!error} helperText={error?.message} {...other} />
        </LocalizationProvider>
      )}
    />
  );
}
