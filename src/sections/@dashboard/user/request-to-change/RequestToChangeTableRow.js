import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
// @mui
import moment from 'moment';
import 'moment/locale/ar-ly';
import { useTheme } from '@mui/material/styles';
import {
  TableRow,
  TableCell,
  MenuItem,
  Slide,
  Dialog,
  Button,
  Toolbar,
  IconButton,
  Typography,
  AppBar,
  ListItem,
  List,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
// components
import useLocales from '../../../../hooks/useLocales';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { CloseIcon } from '../../../../theme/overrides/CustomIcons';
import InvoicePDF from './InvoicePDF';

// ----------------------------------------------------------------------

RequestToChangeTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onApproveRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onRejectRow: PropTypes.func,
};

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        style={{ overflow: 'hidden' }}
      >
        <AppBar>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {translate('request-list.Print-request-to-change')}
            </Typography>
            <Button autoFocus color="inherit">
              {translate('request-list.Print')}
            </Button>
          </Toolbar>
        </AppBar>
      </Dialog>
      <PDFDownloadLink
        document={<InvoicePDF request={row} />}
        fileName={'ComponentToPrint'}
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
