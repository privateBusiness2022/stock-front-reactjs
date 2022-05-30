import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import PeriodNewEditForm from '../../sections/@dashboard/user/PeriodNewEditForm';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function PeriodCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { translate } = useLocales();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  return (
    <Page title={`${translate('periods-list.Periods')} : ${translate('periods-list.New-Period')}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? translate('periods-list.New-Period') : translate('periods-list.Edit-Period')}
          links={[
            { name: translate('Sidebar.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Sidebar.periods'), href: PATH_DASHBOARD.period.list },
            { name: !isEdit ? translate('Sidebar.periods-create') : translate('Sidebar.periods-edit') },
          ]}
        />

        <PeriodNewEditForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
