import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import moment from 'moment';
import 'moment/locale/ar-ly'; // without this line it didn't work
import { paramCase } from 'change-case';
import { Navigate } from 'react-router';

import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import useLocales from '../../../../hooks/useLocales';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

DividingTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function DividingTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onActiveRow,
  onClickRow,
}) {
  const theme = useTheme();
  const { translate } = useLocales();
  moment.locale('ar-ly');

  const { status, stocks, period, dividendEnd, profit } = row;
  const id = window.localStorage.getItem('id');
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected} onClick={onClickRow}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {period?.name}
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
      <TableCell align="left">{moment(dividendEnd).format('DD MMM YYYY')}</TableCell>
      <TableCell align="left">{period.clients?.length}</TableCell>

      <TableCell align="left">{Number(profit).toFixed(2)}</TableCell>
      {/* <TableCell align="left">{ceratedBy?.id === parseInt(id, 10) ? translate('ME') : ceratedBy.name}</TableCell> */}

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
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
