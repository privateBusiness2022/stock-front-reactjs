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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from '@mui/material';
import { useSnackbar } from 'notistack';
// routes
import ReactExport from 'react-data-export';
import moment from 'moment';
// hooks
import { fCurrency } from '../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../routes/paths';
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
import { getById, getAll } from '../../redux/slices/dividing';
import { BookingCustomerReviews } from '../../sections/@dashboard/general/booking';
// print excl

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function StageProfile() {
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

  const queryParams = new URLSearchParams(window.location.search);

  const id = parseInt(queryParams.get('id'), 10);

  const { stages } = useSelector((state) => state.stages);

  const currentStage = stages.find((stage) => stage.id === id);

  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState(currentStage?.period.clients);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // {
  //       columns: [
  //           {title: "Headings", width: {wpx: 80}},//pixels width
  //           {title: "Text Style", width: {wch: 40}},//char width
  //           {title: "Colors", width: {wpx: 90}},
  //       ],
  //       data: [
  //           [
  //               {value: "H1", style: {font: {sz: "24", bold: true}}},
  //               {value: "Bold", style: {font: {bold: true}}},
  //               {value: "Red", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFF0000"}}}},
  //           ],
  //       ]
  //   }
  const report = [
    {
      columns: [
        { title: 'name', width: { wch: 25 } },
        { title: 'profit', width: { wpx: 90 } },
        { title: 'status', width: { wpx: 90 } },
        { title: 'account', width: { wch: 25 } },
        { title: 'phone', width: { wpx: 90 } },
      ],
      data: [
        // [
        //   { value: 'name', style: { font: { sz: '24', bold: true } } },
        //   { value: 'profit', style: { font: { sz: '24', bold: true } } },
        //   { value: 'status', style: { font: { sz: '24', bold: true } } },
        //   { value: 'account', style: { font: { sz: '24', bold: true } } },
        //   { value: 'phone', style: { font: { sz: '24', bold: true } } },
        // ],
      ],
    },
  ];

  report[0].data = currentStage.clientsProfit.map((item) => [
    { value: item.client.name },
    { value: fCurrency(currentStage?.profit * item.stocksNumber) },
    { value: item.stutus },
    { value: item.client.account },
    { value: item.client.phone },
  ]);

  console.log(report);
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
    dispatch(getById(localStorage.getItem('id'), id));
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
        <HeaderBreadcrumbs
          heading={translate('investors-list.List')}
          links={[
            { name: translate('Sidebar.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Sidebar.investors'), href: PATH_DASHBOARD.investor.root },
            { name: translate('Sidebar.investors-list') },
          ]}
          action={
            <>
              <Button
                variant="contained"
                color="success"
                // component={RouterLink}
                // to={PATH_DASHBOARD.investor.new}
                startIcon={<Iconify icon={'eva:trending-up-fill'} />}
                onClick={handleClickOpen}
                style={{ marginRight: '1rem' }}
              >
                {translate('periods-list.dividing')}
              </Button>
              <ExcelFile
                element={
                  <Button
                    variant="contained"
                    color="secondary"
                    // component={RouterLink}
                    // to={PATH_DASHBOARD.investor.new}
                    startIcon={<Iconify icon={'eva:file-text-outline'} />}
                    // onClick={handlePrintReport}
                    style={{ marginRight: '1rem' }}
                  >
                    {translate('periods-list.print-report')}
                  </Button>
                }
                filename={`الدورة - ${currentStage?.period.name} - الفترة - ${moment(currentStage?.start).format(
                  'DD-MM-YYYY'
                )} - ${moment(currentStage?.end).format('DD-MM-YYYY')}`}
              >
                <ExcelSheet dataSet={report} name="Sheet 1" />
              </ExcelFile>
            </>
          }
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{translate('periods-list.dividing')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{translate('periods-list.stage-dividing-description')}</DialogContentText>
          <Grid item paddingTop={5} xs={12} md={12} lg={12}>
            <BookingCustomerReviews clients={currentStage?.clientsProfit} profit={currentStage?.profit} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{translate('Cancel')}</Button>
        </DialogActions>
      </Dialog>
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
