import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import moment from 'moment';
import 'moment/locale/ar-ly'; // without this line it didn't work

import { MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from '../../../../hooks/useLocales';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

ProjectTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ProjectTableRow({
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

  const { name, status, projectFund, date } = row;
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
          {name}
        </Typography>
      </TableCell>

      {/* <TableCell align="left">{moment(end).format('DD MMM YYYY')}</TableCell> */}

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'INACTIVE' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {translate(status)}
        </Label>
      </TableCell>
      <TableCell align="left">{projectFund.map((fund) => `- ${fund.period.name} `)}-</TableCell>

      <TableCell align="left">{moment(date).format('DD MMM YYYY')}</TableCell>

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
