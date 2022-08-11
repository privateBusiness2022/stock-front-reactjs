import PropTypes from 'prop-types';
import React, { useState } from 'react';
// @mui
import { CircularProgress, IconButton, MenuItem, Slide, TableCell, TableRow, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PDFDownloadLink } from '@react-pdf/renderer';
import moment from 'moment';
import 'moment/locale/ar-ly';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import { TableMoreMenu } from '../../../../components/table';
import useLocales from '../../../../hooks/useLocales';
import InvoicePDF from './InvoicePDF';

// ----------------------------------------------------------------------

RequestToChangeTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onApproveRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onRejectRow: PropTypes.func,
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function RequestToChangeTableRow({ row, selected, onApproveRow, onSelectRow, onRejectRow }) {
  const theme = useTheme();

  const { translate } = useLocales();

  const { user, client, date, status } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const [open, setOpen] = React.useState(false);

  console.log(row);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>{client?.name}</TableCell>

      <TableCell align="left">{user?.name}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {moment(date).format('LL')}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'REJECTED' && 'error') || (status === 'PENDING' && 'primary') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {translate(status)}
        </Label>
      </TableCell>
      {status === 'PENDING' && (
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    onRejectRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:close-circle-outline'} />
                  {translate('Reject')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onApproveRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'success.main' }}
                >
                  <Iconify icon={'eva:checkmark-square-2-outline'} />
                  {translate('Approve')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClickOpen();
                  }}
                  sx={{ color: 'primary.main' }}
                >
                  <Iconify icon={'eva:printer-outline'} />
                  {translate('request-list.Print')}
                </MenuItem>
              </>
            }
          />
        </TableCell>
      )}
      <PDFDownloadLink
        document={<InvoicePDF request={row} />}
        fileName={translate('request-list.Requests-To-Change')}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <Tooltip title="Download">
            <IconButton>
              {loading ? <CircularProgress size={24} color="inherit" /> : <Iconify icon={'eva:download-fill'} />}
            </IconButton>
          </Tooltip>
        )}
      </PDFDownloadLink>
    </TableRow>
  );
}
