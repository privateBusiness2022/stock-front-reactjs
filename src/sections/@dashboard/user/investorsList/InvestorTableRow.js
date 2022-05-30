import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
import useLocales from '../../../../hooks/useLocales';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

InvestorTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onClickRow: PropTypes.func,
};

export default function InvestorTableRow({
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

  const { name, phone, account, status, stocks, period } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected} onClick={onClickRow}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell>{name}</TableCell>

      <TableCell align="left">{phone}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {account}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'INACTIVE' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {translate(status)}
        </Label>
      </TableCell>
      <TableCell align="left">{stocks[0]?.price} SDG</TableCell>
      <TableCell align="left">{stocks[0]?.number}</TableCell>

      <TableCell align="left">{period?.name}</TableCell>

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
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                {translate('Edit')}
              </MenuItem>
              {status === 'INACTIVE' ? (
                <MenuItem
                  onClick={() => {
                    onActiveRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:checkmark-fill'} />
                  {translate('Active')}
                </MenuItem>
              ) : null}
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
