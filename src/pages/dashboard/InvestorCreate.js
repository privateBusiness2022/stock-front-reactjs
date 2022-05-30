import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InvestorNewEditForm from '../../sections/@dashboard/user/InvestorNewEditForm';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function InvestorCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { translate } = useLocales();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const currentUser = _userList.find((user) => paramCase(user.name) === name);

  return (
    <Page title={`${translate('investors-list.investors')} : ${translate('investors-list.new')}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? translate('investors-list.new') : translate('investors-list.edit')}
          links={[
            { name: translate('investors-list.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('investors-list.investors'), href: PATH_DASHBOARD.investor.list },
            { name: !isEdit ? translate('investors-list.new') : translate('investors-list.edit') },
          ]}
        />

        <InvestorNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
