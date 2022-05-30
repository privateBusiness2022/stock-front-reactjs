// @mui
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
//
import EmptyContent from '../EmptyContent';

import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
};

export default function TableNoData({ isNotFound }) {
  const { translate } = useLocales();
  return (
    <>
      {isNotFound ? (
        <TableRow>
          <TableCell colSpan={9}>
            <EmptyContent
              title={translate('No-Data')}
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={9} sx={{ p: 0 }} />
        </TableRow>
      )}
    </>
  );
}
