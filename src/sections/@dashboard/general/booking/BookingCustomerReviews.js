import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Chip, Stack, Avatar, Rating, Button, CardHeader, Typography, styled } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import axios from '../../../../utils/axios';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// _mock_
import { _bookingReview } from '../../../../_mock';
// components
import Iconify from '../../../../components/Iconify';
import { CarouselArrows } from '../../../../components/carousel';
import useLocales from '../../../../hooks/useLocales';
import { fCurrency } from '../../../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const RowStyle = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

export default function BookingCustomerReviews({ clients, profit }) {
  const theme = useTheme();

  const carouselRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { translate } = useLocales();

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    adaptiveHeight: true,
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`/periods/profit/${id}`);
      if (response.status === 200) {
        enqueueSnackbar(translate('Active-success!'), { variant: 'success' });
        handleNext();
      } else {
        enqueueSnackbar(translate('Error-occurred'), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(translate(error.message), { variant: 'error' });
    }
  };

  function ReviewItem({ item }) {
    const { id, client, stocksNumber, price } = item;

    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {translate('periods-list.profit')}
        </Typography>

        <Stack spacing={2}>
          <Typography variant="h3">{fCurrency(stocksNumber * profit)}</Typography>

          <RowStyle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('investors-list.name')}
            </Typography>
            <Typography variant="body2">{client?.name}</Typography>
          </RowStyle>

          <RowStyle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('investors-list.account')}
            </Typography>
            <Typography variant="subtitle1">{client?.account}</Typography>
          </RowStyle>

          <RowStyle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('investors-list.Phone')}
            </Typography>
            <Typography variant="body2">{client?.phone}</Typography>
          </RowStyle>

          <Stack direction="row" spacing={1.5}>
            <Button fullWidth variant="contained" onClick={() => handleApprove(id)} color="success">
              {translate('Done')}
            </Button>
            <Button fullWidth onClick={handleNext} variant="contained" color="secondary">
              {translate('Next')}
            </Button>
          </Stack>
        </Stack>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={translate('periods-list.dividing')}
        subheader={`${clients?.length} ${translate('periods-list.investor')}`}
        action={
          <CarouselArrows
            customIcon={'ic:round-keyboard-arrow-right'}
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{ '& .arrow': { width: 28, height: 28, p: 0 } }}
          />
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        {clients.map((item) => (item.stutus === 'PENDING' ? <ReviewItem key={item.id} item={item} /> : null))}
      </Slider>
    </Card>
  );
}

// ----------------------------------------------------------------------
