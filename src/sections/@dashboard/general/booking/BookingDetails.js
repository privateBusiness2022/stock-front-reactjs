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
import axios from '../../../../utils/axios';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { getUsers } from '../../../../redux/slices/dividing';

// ----------------------------------------------------------------------

BookingDetails.propTypes = {
  stages: PropTypes.array,
};

export default function BookingDetails({ stages, users }) {
  const theme = useTheme();

  const [profit, setProfit] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { coUsers } = useSelector((state) => state.stages);

  const [usersIds, setUsersIds] = useState([]);

  const [coUsersIds, setCoUsersIds] = useState([]);

  const [open, setOpen] = useState(false);

  const [openCommission, setOpenCommission] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpenCommission = (id) => {
    dispatch(getUsers(id));
    setOpenCommission(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseCommission = () => {
    setOpenCommission(false);
  };

  const { translate } = useLocales();

  const isLight = theme.palette.mode === 'light';

  const { enqueueSnackbar } = useSnackbar();

  const handelProfitUpdate = async (id) => {
    const data = usersIds.map((userId) => ({
      id: userId,
    }));
    try {
      const response = await axios.patch(`/periods/stages/${id}`, { profit: parseFloat(profit), usersIds: data });
      if (response.status === 201) {
        enqueueSnackbar(translate('Update-success!'));
        navigate(PATH_DASHBOARD.period.list);
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
    }
  };

  const handleAddCommission = async (id) => {
    try {
      const response = await axios.post(`/periods/${id}/commissions`, { commissions: coUsersIds });
      if (response.status === 201) {
        enqueueSnackbar(translate('Update-success!'));
        navigate(PATH_DASHBOARD.period.list);
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
    }
  };

  function handelCheckboxChange(id) {
    const index = usersIds.indexOf(id);
    if (index === -1) {
      setUsersIds([...usersIds, id]);
    } else {
      setUsersIds(usersIds.filter((item) => item !== id));
    }
  }

  function handleCommissionFelidChange(event, id) {
    // find id in object in coUsersIds
    const index = coUsersIds.findIndex((item) => item.id === id);
    if (index === -1) {
      setCoUsersIds([...coUsersIds, { id, amount: event.target.value }]);
    } else {
      setCoUsersIds(coUsersIds.map((item) => (item.id === id ? { id, amount: event.target.value } : item)));
    }
  }

  return (
    <>
      <Card>
        <CardHeader title={translate('periods-list.stages')} sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 160 }}>id</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.start')}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.end')}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.dividend-start')}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.dividend-end')}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{translate('periods-list.status')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {stages?.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2">{row.id}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{format(new Date(row.start), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{format(new Date(row.end), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      {format(new Date(row.end).setDate(new Date(row.end).getDate() + 1), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{format(new Date(row.dividendEnd), 'dd MMM yyyy')}</TableCell>

                    <TableCell>
                      <Label
                        variant={isLight ? 'ghost' : 'filled'}
                        color={
                          (row.status === 'STARTED' && 'success') ||
                          (row.status === 'PENDING' && 'warning') ||
                          (row.status === 'STOPPED' && 'error') ||
                          (row.status === 'DIVIDEND_STARTED' && 'warning') ||
                          (row.status === 'DIVIDEND_ENDED' && 'success')
                        }
                      >
                        {translate(row.status)}
                      </Label>
                    </TableCell>

                    {/* <TableCell>{row.status}</TableCell> */}
                    {/* <TableCell sx={{ textTransform: 'capitalize' }}>{row.roomType}</TableCell> */}

                    <TableCell align="left">
                      {row?.profit === 0 ? (
                        <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                          {translate('ADD-PROFIT')}
                        </Button>
                      ) : null}
                      {row?.commissions?.length === 0 && row?.profit !== 0 ? (
                        <Button variant="contained" color="secondary" onClick={() => handleOpenCommission(row.id)}>
                          {translate('ADD-COMMISSION')}
                        </Button>
                      ) : null}
                      <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>{translate('add-stage-profit')}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>{translate('add-stage-profit-description')}</DialogContentText>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={translate('periods-list.profit')}
                            type="number"
                            value={profit}
                            onChange={(e) => setProfit(e.target.value)}
                            fullWidth
                            variant="standard"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                          />

                          <DialogContentText paddingTop={4}>
                            {translate('add-stage-users-description')}
                          </DialogContentText>

                          <FormGroup>
                            {users?.map((user) =>
                              user.role === 'ACCOUNTER' ? (
                                <FormControlLabel
                                  onChange={() => handelCheckboxChange(user.id)}
                                  control={<Checkbox />}
                                  label={user.name}
                                />
                              ) : null
                            )}
                          </FormGroup>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>{translate('Cancel')}</Button>
                          <Button
                            onClick={() => {
                              handelProfitUpdate(row?.id);
                            }}
                          >
                            {translate('Save-Changes')}
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <Dialog open={openCommission} onClose={handleCloseCommission}>
                        <DialogTitle>{translate('add-stage-commission')}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>{translate('add-stage-commission-description')}</DialogContentText>

                          <FormGroup>
                            <Box
                              sx={{
                                display: 'grid',
                                columnGap: 2,
                                rowGap: 3,
                                marginTop: 4,
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                              }}
                            >
                              {coUsers?.map((user) => (
                                <TextField
                                  key={user.id}
                                  name={`periodFund${user.id}`}
                                  type="number"
                                  onChange={(e) => handleCommissionFelidChange(e, user?.id)}
                                  label={`${translate('stage-commission')}  ${user.name}`}
                                  required
                                />
                              ))}
                            </Box>
                          </FormGroup>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseCommission}>{translate('Cancel')}</Button>
                          <Button
                            onClick={() => {
                              handleAddCommission(row?.id);
                            }}
                          >
                            {translate('Save-Changes')}
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
            View All
          </Button>
        </Box>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------
