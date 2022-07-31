import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  InputAdornment,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
// _mock_
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { _bookings } from '../../../../_mock';
import { useDispatch, useSelector } from '../../../../redux/store';
import { RHFTextField } from '../../../../components/hook-form';
//
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import MenuPopover from '../../../../components/MenuPopover';
import useLocales from '../../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

BookingDetails.propTypes = {
  periods: PropTypes.array,
};

export default function BookingDetails({ periods }) {
  const theme = useTheme();

  const navigate = useNavigate();

  const { translate } = useLocales();

  const isLight = theme.palette.mode === 'light';

  return (
    <>
      <Card>
        <CardHeader title={translate('periods-list.all')} sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.name')}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.status')}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.clients')}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.fund')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {periods?.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row?.period.name}</TableCell>
                    <TableCell>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={(row?.period.status === 'STOPPED' && 'error') || 'success'}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {translate(row?.period.status)}
                      </Label>
                    </TableCell>
                    <TableCell>{row?.period.clients.length}</TableCell>
                    <TableCell>{`${Number(row?.fund).toFixed(1)} SDG`}</TableCell>

                    {/* <TableCell>{row.status}</TableCell> */}
                    {/* <TableCell sx={{ textTransform: 'capitalize' }}>{row.roomType}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------
