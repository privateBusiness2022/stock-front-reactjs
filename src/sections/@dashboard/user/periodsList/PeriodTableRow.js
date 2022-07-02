import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import moment from 'moment';
import 'moment/locale/ar-ly'; // without this line it didn't work
import { paramCase } from 'change-case';
import { Navigate, useNavigate } from 'react-router';

import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import useLocales from '../../../../hooks/useLocales';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

PeriodTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function PeriodTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onActiveRow }) {
  const theme = useTheme();
  const { translate } = useLocales();
  moment.locale('ar-ly');

  const navigate = useNavigate();

  const { name, status, stocks, clients, ceratedBy } = row;
  const id = window.localStorage.getItem('id');
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      {/* <TableCell align="left">{moment(end).format('DD MMM YYYY')}</TableCell> */}

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'STOPPED' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {translate(status)}
        </Label>
      </TableCell>
      <TableCell align="left">{clients.length}</TableCell>

      <TableCell align="left">{Number(stocks?.number).toFixed(2)}</TableCell>
      <TableCell align="left">{ceratedBy.id === parseInt(id, 10) ? translate('ME') : ceratedBy.name}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                {translate('Delete')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(PATH_DASHBOARD.period.profile(paramCase(`${row.id}`)));
                }}
                sx={{ color: 'purple.main' }}
              >
                <Iconify icon={'eva:briefcase-outline'} />
                {translate('Profile')}
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
