import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
import { useSnackbar } from 'notistack';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import axios from '../../utils/axios';
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
import { useDispatch, useSelector } from '../../redux/store';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import {
  RequestToChangeTableToolbar,
  RequestToWithdrawalTableRow,
} from '../../sections/@dashboard/user/request-to-change';
import useLocales from '../../hooks/useLocales';
import { getRequestsToWithdrawal } from '../../redux/slices/request';

export default function RequestToWithdrawalList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const { translate } = useLocales();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { requests } = useSelector((state) => state.requests);

  const [tableData, setTableData] = useState(requests.requestsToWithdrawal);

  const [filterName, setFilterName] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('PENDING');

  // ----------------------------------------------------------------------

  const STATUS_OPTIONS = [
    { title: translate('request-list.all'), value: 'ALL' },
    { title: translate('request-list.pending'), value: 'PENDING' },
    { title: translate('request-list.approved'), value: 'APPROVED' },
    { title: translate('request-list.rejected'), value: 'REJECTED' },
  ];

  const TABLE_HEAD = [
    { id: 'investor-name', label: translate('request-list.investor-name'), align: 'left' },
    { id: 'period-name', label: translate('request-list.period-name'), align: 'left' },
    { id: 'date', label: translate('request-list.date'), align: 'left' },
    { id: 'withdraw-date', label: translate('request-list.withdraw-date'), align: 'left' },
    { id: 'status', label: translate('request-list.status'), align: 'left' },
    { id: 'stocks-number', label: translate('request-list.stocks-number'), align: 'left' },
    { id: 'stocks-price', label: translate('request-list.stocks-price'), align: 'left' },
    { id: '' },
  ];

  // ----------------------------------------------------------------------

  useEffect(() => {
    dispatch(getRequestsToWithdrawal());
  }, [dispatch]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleApproveRow = async (id) => {
    try {
      const response = await axios.get(`/clients/stocks-withdrawal/approve/${id}`);
      if (response.status === 200) {
        // await dispatch(getAll());
        enqueueSnackbar(translate('Approve-success!'), { variant: 'success' });
        navigate(PATH_DASHBOARD.request.list);
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(`${id}`)));
  };

  const handleRejectRow = async (id) => {
    try {
      const response = await axios.get(`/clients/stocks-withdrawal/reject/${id}`);
      console.log(response.status);
      if (response.status === 200) {
        // await dispatch(getAll());
        enqueueSnackbar(translate('Reject-success!'), { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);

  return (
    <Page title={translate('request-list.List')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('request-list.List')}
          links={[
            { name: translate('user-list.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('request-list.Requests'), href: PATH_DASHBOARD.request.root },
            { name: translate('request-list.Requests-To-Withdrawal') },
          ]}
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab.value} label={tab.title} value={tab.value} />
            ))}
          </Tabs>

          <Divider />

          <RequestToChangeTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <RequestToWithdrawalTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onRejectRow={() => handleRejectRow(row.id)}
                      onApproveRow={() => handleApproveRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label={translate('Dense')}
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'ALL') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterRole !== 'ALL') {
    tableData = tableData.filter((item) => item.role === filterRole);
  }

  return tableData;
}
