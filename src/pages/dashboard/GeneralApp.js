// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// hooks
import { useEffect, useState } from 'react';
import DividingList from './DividingList';
import InvestorList from './InvestorList';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { useDispatch, useSelector } from '../../redux/store';
import { getNumber } from '../../redux/slices/dividing';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
import axios from '../../utils/axios';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const { translate } = useLocales();

  const dispatch = useDispatch();

  const { numbers } = useSelector((state) => state.stages);

  useEffect(() => {
    dispatch(getNumber());
  }, []);

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {numbers ? (
            <>
              <Grid item xs={12} md={12} lg={12}>
                <Stack direction={'row'} spacing={3}>
                  <AppWidget
                    title={translate('total-active-clients')}
                    total={numbers?.clients?.total}
                    icon={'eva:person-fill'}
                    color="success"
                    chartData={(numbers?.clients?.active / numbers?.clients?.total) * 100}
                  />
                  <AppWidget
                    title={translate('total-requests-to-change')}
                    total={numbers?.requestsToChange?.total}
                    icon={'eva:email-fill'}
                    color="warning"
                    chartData={(numbers?.requestsToChange?.pending / numbers?.requestsToChange?.total) * 100}
                  />
                  <AppWidget
                    title={translate('total-active-stages')}
                    total={numbers?.stages?.total}
                    icon={'eva:email-fill'}
                    chartData={(numbers?.stages?.active / numbers?.stages?.total) * 100}
                  />
                  <AppWidget
                    title={translate('total-request-to-withdrawal')}
                    total={numbers?.pendingRequestToWithdrawal?.total}
                    icon={'eva:email-fill'}
                    color="error"
                    chartData={
                      (numbers?.pendingRequestToWithdrawal?.pending / numbers?.pendingRequestToWithdrawal?.total) * 100
                    }
                  />
                  <AppWidget
                    title={translate('total-active-users')}
                    total={numbers?.users?.total}
                    icon={'eva:person-fill'}
                    color="secondary"
                    chartData={(numbers?.users?.active / numbers?.users?.total) * 100}
                  />
                </Stack>
              </Grid>

              {/* <Grid item xs={12} md={6} lg={4}>
              <AppCurrentDownload />
            </Grid> */}

              {/* <Grid item xs={12} md={6} lg={8}>
              <AppAreaInstalled />
            </Grid> */}

              <Grid item xs={12} lg={12}>
                {/* <AppNewInvoice /> */}
                <DividingList show={false} />
              </Grid>

              <Grid item xs={12} lg={12}>
                {/* <AppNewInvoice /> */}
                <InvestorList show={false} />
              </Grid>

              {/* <Grid item xs={12} md={6} lg={4}>
              <AppTopRelated />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AppTopInstalledCountries />
            </Grid> */}

              {/* <Grid item xs={12} md={6} lg={4}>
              <AppTopAuthors />
            </Grid> */}
            </>
          ) : null}
        </Grid>
      </Container>
    </Page>
  );
}
