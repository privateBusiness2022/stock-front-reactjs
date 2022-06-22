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
  TextField,
  InputAdornment,
  FormGroup,
  Checkbox,
  DialogActions,
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
import { ProjectTableToolbar, ProjectTableRow } from '../../sections/@dashboard/user/projectsList';
import useLocales from '../../hooks/useLocales';
import { getAll } from '../../redux/slices/projects';
import { getAll as getAllPeriods } from '../../redux/slices/periods';

export default function ProjectList() {
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

  const [periodsIds, setPeriodsIds] = useState([]);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { projects } = useSelector((state) => state.projects);

  const { periods } = useSelector((state) => state.periods);

  const [tableData, setTableData] = useState(projects);

  const [filterName, setFilterName] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('ALL');

  // ----------------------------------------------------------------------

  const STATUS_OPTIONS = [
    { title: translate('project-list.all'), value: 'ALL' },
    { title: translate('project-list.active'), value: 'ACTIVE' },
    { title: translate('project-list.inactive'), value: 'INACTIVE' },
  ];

  const TABLE_HEAD = [
    { id: 'name', label: translate('periods-list.name'), align: 'left' },
    // { id: 'start', label: translate('periods-list.start'), align: 'left' },
    // { id: 'end', label: translate('periods-list.end'), align: 'left' },
    { id: 'status', label: translate('periods-list.status'), align: 'left' },
    { id: 'periods', label: translate('periods-list.Periods'), align: 'left' },
    // { id: 'stocks', label: translate('periods-list.stocks'), align: 'left' },
    { id: 'date', label: translate('periods-list.date'), align: 'left' },
    { id: '' },
  ];

  // ----------------------------------------------------------------------

  useEffect(() => {
    dispatch(getAll());
    dispatch(getAllPeriods());
  }, [dispatch]);

  useEffect(() => {
    setTableData(projects);
  }, [projects]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  function handelCheckboxChange(id) {
    const index = periodsIds.indexOf(id);
    if (index === -1) {
      setPeriodsIds([...periodsIds, id]);
    } else {
      setPeriodsIds(periodsIds.filter((item) => item !== id));
    }
  }

  const handleDeleteRow = async (id) => {
    try {
      const response = await axios.delete(`/projects/${id}`);
      console.log(response.status);
      if (response.status === 200) {
        await dispatch(getAll());
        enqueueSnackbar(translate('Delete-success!'), { variant: 'success' });
        navigate(PATH_DASHBOARD.project.list);
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

  const handelCreateProject = async () => {
    const data = periodsIds.map((id) => ({
      id,
    }));
    try {
      const response = await axios.post(`/projects`, { name, periodsIds: data });
      console.log(response.status);
      if (response.status === 201) {
        await dispatch(getAll());
        enqueueSnackbar(translate('Save-success!'), { variant: 'success' });
        navigate(PATH_DASHBOARD.project.list);
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
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
    <Page title={translate('project-list.List')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('project-list.List')}
          links={[
            { name: translate('Sidebar.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Sidebar.projects'), href: PATH_DASHBOARD.project.root },
            { name: translate('Sidebar.projects-list') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.project.new}
              // onClick={navigate(PATH_DASHBOARD.project.new)}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('project-list.new-project')}
            </Button>
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

          <ProjectTableToolbar filterName={filterName} onFilterName={handleFilterName} />

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
                  {projects.length !== 0
                    ? dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <ProjectTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onActiveRow={() => handelActiveRow(row.id)}
                          // onClickRow={() => navigate(PATH_DASHBOARD.period.profile(paramCase(`${row.id}`)))}
                        />
                      ))
                    : null}

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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{translate('add-project')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{translate('add-project-description')}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={translate('periods-list.project')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="standard"
            />

            <DialogContentText paddingTop={4}>{translate('add-project-fund-description')}</DialogContentText>

            <FormGroup>
              {periods?.map((period) => (
                <FormControlLabel
                  onChange={() => handelCheckboxChange(period.id)}
                  control={<Checkbox />}
                  label={period.name}
                />
              ))}
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{translate('Cancel')}</Button>
            <Button onClick={handelCreateProject}>{translate('Save-Changes')}</Button>
          </DialogActions>
        </Dialog>
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
