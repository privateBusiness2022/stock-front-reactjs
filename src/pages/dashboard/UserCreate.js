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
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { translate } = useLocales();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const currentUser = _userList.find((user) => paramCase(user.name) === name);

  return (
    <Page title={`${translate('user-list.Users')} : ${translate('user-list.New-User')}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? translate('user-list.New-User') : translate('user-list.Edit-User')}
          links={[
            { name: translate('user-list.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('user-list.Users'), href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? translate('user-list.New-User') : translate('user-list.Edit-User') },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
