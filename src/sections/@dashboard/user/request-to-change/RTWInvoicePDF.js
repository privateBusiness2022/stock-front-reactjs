import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
import styles from '../../invoice/details/InvoiceStyle';
import useLocales from '../../../../hooks/useLocales';
//

// ----------------------------------------------------------------------

RTWInvoicePDF.propTypes = {
  request: PropTypes.object.isRequired,
};

export default function RTWInvoicePDF({ request }) {
  const { translate } = useLocales();

  const { client, date, user, id, status } = request;

  console.log(client);
  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.alignRight]}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
            <Text style={styles.h3}>LOGO</Text>
          </View>
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>{translate(status)}</Text>
            <Text> {id} </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col4}>
            <Text style={[styles.overline, styles.mb8]} />
            <Text style={styles.body1} />
            <Text style={styles.body1} />
            <Text style={styles.body1} />
          </View>

          <View style={styles.col8}>
            <Text style={[styles.overline]}>{translate('request-list.Requests-To-Withdrawal')}</Text>
            <Text style={[styles.body1]}>{`${client.name} : ${translate('request-list.message-start')}`}</Text>
            <Text style={[styles.body1]}>{`${client.account} : ${translate('request-list.message-middle')}`}</Text>
          </View>
        </View>
        {/* ${' '}
            ${client.name} ${'    '} ${translate('request-list.message-start')} ${' '}
            ${translate('request-list.message-middle')} ${' '} ${client.account}, ${' '}
            ${' '}
            ${translate('request-list.message-end')} */}

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>{translate('request-list.date')}</Text>
            <Text style={styles.body1}>{fDate(date)}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>{translate('request-list.stocks-description')}</Text>
            <Text style={styles.body1}>{`${client.stocks[0].number} : ${translate(
              'request-list.stocks-number'
            )}`}</Text>
            <Text style={styles.body1}>{`${client.stocks[0].price} : ${translate('request-list.stocks-price')}`}</Text>
            <Text style={styles.body1}>{`${client.stocks[0].price * client.stocks[0].number} SDG : ${translate(
              'request-list.stocks-total'
            )}`}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>{translate('request-list.request-from')}</Text>
            <Text>{`${user.name} - ${user.phone}`}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
