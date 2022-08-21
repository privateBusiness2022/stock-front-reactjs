import PropTypes from 'prop-types';
// @mui
import { Box, List, ListSubheader } from '@mui/material';
import { styled } from '@mui/material/styles';
//
import useLocales from '../../../hooks/useLocales';
import { getRole } from '../../../utils/jwt';
import { NavListRoot } from './NavList';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  })
);

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSectionVertical({ navConfig, isCollapse = false, ...other }) {
  const role = getRole();
  const { translate } = useLocales();
  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {translate(`Sidebar.${group.subheader}`)}
          </ListSubheaderStyle>

          {group.items.map((list) =>
            list?.auth?.includes(role) ? <NavListRoot key={list.title} list={list} isCollapse={isCollapse} /> : null
          )}
        </List>
      ))}
    </Box>
  );
}
