import { Document, Page, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { fCurrency } from '../../../../utils/formatNumber';
// utils
import useLocales from '../../../../hooks/useLocales';
import { fDate } from '../../../../utils/formatTime';
import styles from '../../invoice/details/InvoiceStyle';
//

// ----------------------------------------------------------------------

PeriodPDF.propTypes = {
  request: PropTypes.object.isRequired,
};

export default function PeriodPDF({ request }) {
  const { translate } = useLocales();

  const { clients, projectsFund, stages, stocks, ceratedBy, name, id, status } = request;

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
            <Text style={[styles.overline, styles.mb8]}>Due date</Text>
            <Text style={styles.body1}>{fDate(new Date())}</Text>
          </View>

          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>الاحصائات</Text>
            <Text style={styles.body1}>{`${clients.length} : عدد المستثمرين`}</Text>
            <Text style={styles.body1}>{`${stocks.number} : عدد الاسهم المتاحة`}</Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8, styles.mt8]}>المستثمرين</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>الاسم</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>الهاتف</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>الاسهم</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>قيمة الاسهم</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {clients.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.name}</Text>
                  <Text>{item.description}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.phone}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item?.stocks[0].number}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{`${fCurrency(item?.stocks[0].number * item?.stocks[0].price)} SDG`}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8, styles.mt8]} />
        <Text style={[styles.overline, styles.mb8, styles.mt8]}>الفترات</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>رقم</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}> البداية</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>نهاية توزيع الارباع </Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}> الحالة</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {stages.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.id}</Text>
                  <Text>{item.description}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{format(new Date(item?.start), 'dd MMM yyyy')}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{format(new Date(item?.dividendEnd), 'dd MMM yyyy')}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{`${translate(item?.status)}`}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8, styles.mt8]} />
        <Text style={[styles.overline, styles.mb8]}>المشاريع الممولة</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>الاسم</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}> قيمة التويل</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {projectsFund.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item?.project.name}</Text>
                  <Text>{item.description}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{`${Number(item?.fund).toFixed(1)} SDG`}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>تفاصيل المنشي</Text>
            <Text>{`${ceratedBy.name} - ${ceratedBy.phone}`}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
