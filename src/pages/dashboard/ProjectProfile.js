import { useEffect } from 'react';
// @mui
import { Grid, Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  BookingDetails,
  BookingBookedRoom,
  BookingTotalIncomes,
  BookingRoomAvailable,
  BookingNewestBooking,
  BookingWidgetSummary,
  BookingCheckInWidgets,
  BookingCustomerReviews,
  BookingReservationStats,
  FundingPeriods,
} from '../../sections/@dashboard/general/booking';
// Hooks
import { useDispatch, useSelector } from '../../redux/store';
import { getAll } from '../../redux/slices/users';

// assets
import { BookingIllustration, DocIllustration, SeoIllustration } from '../../assets';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function ProjectProfile() {
  const { themeStretch } = useSettings();

  const { translate } = useLocales();

  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(window.location.search);

  const id = parseInt(queryParams.get('id'), 10);

  const { projects } = useSelector((state) => state.projects);

  const { users } = useSelector((state) => state.users);

  const currentProject = projects.find((project) => project.id === id);

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  return (
    <Page title={currentProject?.name}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title={translate('Total-Funds')}
              total={currentProject?.projectFund.reduce((a, b) => a + b?.fund, 0)}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid item xs={12}>
            <FundingPeriods periods={currentProject?.projectFund} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
