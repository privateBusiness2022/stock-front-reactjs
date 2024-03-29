import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { CircularProgress, IconButton, MenuItem, TableCell, TableRow, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PDFDownloadLink } from '@react-pdf/renderer';
import moment from 'moment';
import 'moment/locale/ar-ly';
import useLocales from '../../../../hooks/useLocales';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import { TableMoreMenu } from '../../../../components/table';
import RTWInvoicePDF from './RTWInvoicePDF';

// ----------------------------------------------------------------------

RequestToWithdrawalTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onApproveRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onRejectRow: PropTypes.func,
};

export default function RequestToWithdrawalTableRow({ row, selected, onApproveRow, onSelectRow, onRejectRow }) {
  const theme = useTheme();

  const { translate } = useLocales();

  const { client, date, price, withdrawDate, status } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>{client?.name}</TableCell>

      <TableCell align="left">{client?.period?.name}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {moment(date).format('LL')}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {moment(withdrawDate).format('LL')}
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

      <TableCell align="left">{Number(price) / Number(client?.stocks[0]?.stock?.priceOfOne)}</TableCell>
      <TableCell align="left">{`SDG ${price}`}</TableCell>

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
              </>
            }
          />
        </TableCell>
      )}
      <PDFDownloadLink
        document={<RTWInvoicePDF request={row} />}
        fileName={translate('request-list.Requests-To-Withdrawal')}
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
