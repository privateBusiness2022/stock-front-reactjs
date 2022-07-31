import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
import styles from '../../invoice/details/InvoiceStyle';
import useLocales from '../../../../hooks/useLocales';
//

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  request: PropTypes.object.isRequired,
};

export default function InvoicePDF({ request }) {
  const { translate } = useLocales();

  const { client, date, name, phone, account, user, id, status } = request;

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
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>{translate('request-list.change-to')}</Text>
            <Text style={styles.body1}>{name}</Text>
            <Text style={styles.body1}>{account}</Text>
            <Text style={styles.body1}>{phone}</Text>
          </View>

          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>{translate('request-list.change-from')}</Text>
            <Text style={styles.body1}>{client.name}</Text>
            <Text style={styles.body1}>{client.account}</Text>
            <Text style={styles.body1}>{client.phone}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Date create</Text>
            <Text style={styles.body1}>{fDate(date)}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Due date</Text>
            <Text style={styles.body1}>{fDate(new Date())}</Text>
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
