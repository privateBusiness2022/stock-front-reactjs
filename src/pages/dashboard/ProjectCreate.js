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
import ProjectNewEditForm from '../../sections/@dashboard/user/ProjectNewEditForm';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function ProjectCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { translate } = useLocales();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  return (
    <Page title={`${translate('project-list.Projects')} : ${translate('project-list.new-project')}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? translate('project-list.new-project') : translate('project-list.Edit-Project')}
          links={[
            { name: translate('Sidebar.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Sidebar.projects'), href: PATH_DASHBOARD.project.list },
            { name: !isEdit ? translate('Sidebar.projects-create') : translate('Sidebar.projects-edit') },
          ]}
        />

        <ProjectNewEditForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
