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
import { InvestorTableToolbar, InvestorTableRow } from '../../sections/@dashboard/user/investorsList';
import useLocales from '../../hooks/useLocales';
import { getAll } from '../../redux/slices/investor';

export default function InvestorList({ show = true }) {
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

  const { investors } = useSelector((state) => state.investors);

  const [tableData, setTableData] = useState(investors);

  const [filterName, setFilterName] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('ALL');

  // ----------------------------------------------------------------------

  const STATUS_OPTIONS = [
    { title: translate('investors-list.all'), value: 'ALL' },
    { title: translate('investors-list.active'), value: 'ACTIVE' },
    { title: translate('investors-list.inactive'), value: 'INACTIVE' },
  ];

  const TABLE_HEAD = [
    { id: 'name', label: translate('investors-list.name'), align: 'left' },
    { id: 'phone', label: translate('investors-list.Phone'), align: 'left' },
    { id: 'account', label: translate('investors-list.account'), align: 'left' },
    { id: 'status', label: translate('investors-list.status'), align: 'left' },
    { id: 'stocksPrice', label: translate('investors-list.stocks-Price'), align: 'left' },
    { id: 'number', label: translate('investors-list.stocks'), align: 'left' },
    { id: 'period', label: translate('investors-list.period'), align: 'left' },
    { id: '' },
  ];

  // ----------------------------------------------------------------------

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await axios.delete(`/users/${id}`);
      console.log(response.status);
      if (response.status === 200) {
        await dispatch(getAll());
        enqueueSnackbar(translate('Delete-success!'), { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
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
    console.log(id);
    navigate(PATH_DASHBOARD.user.edit(paramCase(`${id}`)));
  };

  const handelActiveRow = async (id) => {
    try {
      const response = await axios.put(`/users/${id}/activate`);
      console.log(response.status);
      if (response.status === 200) {
        await dispatch(getAll());
        enqueueSnackbar(translate('Active-success!'), { variant: 'success' });
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
    <Page title={translate('investors-list.List')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {show ? (
          <HeaderBreadcrumbs
            heading={translate('investors-list.List')}
            links={[
              { name: translate('Sidebar.dashboard'), href: PATH_DASHBOARD.root },
              { name: translate('Sidebar.investors'), href: PATH_DASHBOARD.investor.root },
              { name: translate('Sidebar.investors-list') },
            ]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.investor.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                {translate('investors-list.new')}
              </Button>
            }
          />
        ) : null}

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

          <InvestorTableToolbar filterName={filterName} onFilterName={handleFilterName} />

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
                    <InvestorTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onActiveRow={() => handelActiveRow(row.id)}
                      onClickRow={() => navigate(PATH_DASHBOARD.investor.edit(paramCase(`${row.id}`)))}
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

  return tableData;
}
