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
} from '../../sections/@dashboard/general/booking';
// Hooks
import { useDispatch, useSelector } from '../../redux/store';
import { getAll } from '../../redux/slices/users';

// assets
import { BookingIllustration, DocIllustration, SeoIllustration } from '../../assets';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function PeriodProfile() {
  const { themeStretch } = useSettings();

  const { translate } = useLocales();

  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(window.location.search);

  const id = parseInt(queryParams.get('id'), 10);

  const { periods } = useSelector((state) => state.periods);

  const { users } = useSelector((state) => state.users);

  const currentPeriod = periods.find((period) => period.id === id);

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  return (
    <Page title={currentPeriod?.name}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title={translate('Total-Investors')}
              total={currentPeriod?.clients.length}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title={translate('Available-Stocks')}
              total={currentPeriod?.stocks.number}
              icon={<DocIllustration />}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <BookingNewestBooking />
          </Grid> */}

          <Grid item xs={12}>
            <BookingDetails stages={currentPeriod?.stages} users={users} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
