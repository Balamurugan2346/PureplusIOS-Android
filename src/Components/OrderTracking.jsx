import { useTheme } from '../Context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import { LayoutAnimation, Linking, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import Fonts from '../../assets/fonts/Fonts';
import VectorBg from './VectorBg';
import OrderTimeline from '../Components/OrderTracking/OrderTimeLIne';
import { statusLabel, formatOrderTime } from '../Utils/orderStatus';

/**
 * Dashboard "track current order" card — fully dynamic off the current order payload.
 * Only rendered by the Dashboard when there IS an active order (orderId present), so
 * every field below comes from `currentOrder.data`; missing fields are simply hidden.
 */
const OrderTracking = ({ title, description, style, currentOrder, navigation }) => {
  const { theme } = useTheme();
  const order = currentOrder?.data ?? {};

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [expanded, setExpanded] = useState(false);

  const callNumber = (phone) => phone && Linking.openURL(`tel:${phone}`);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((p) => !p);
  };

  const openFullTracking = () => {
    if (order?.orderId) navigation.navigate('OrderTrackingScreen', { id: order.orderId });
  };

  const headerConfig = { color: theme.buttonText, fontFamily: Fonts.family.bold, fontSize: Fonts.size.sm };
  const paratextConfig = { color: theme.secondaryText, fontFamily: Fonts.family.regular, fontSize: Fonts.size.xs };
  const valueConfig = { color: theme.buttonText, fontFamily: Fonts.family.medium, fontSize: Fonts.size.xs, marginTop: 2 };

  const driverName = order?.deliveryPartnerName ?? order?.driverName ?? order?.deliveryPersonName;
  const driverPhone = order?.deliveryPartnerPhone ?? order?.driverPhone ?? order?.deliveryPersonPhone;
  const receiver = order?.receiverName;
  const receiverPhone = order?.receiverPhone;

  const Row = ({ label, value }) =>
    value ? (
      <View style={{ marginVertical: 5 }}>
        <Text style={paratextConfig}>{label}</Text>
        <Text style={valueConfig}>{value}</Text>
      </View>
    ) : null;

  return (
    <View style={style}>
      <LinearGradient
        colors={[theme.inputContainerBorder, theme.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardContainer}
      >
        <TouchableOpacity onPress={toggleExpand} style={styles.innerRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <VectorBg icon={'location'} bgColor={'lightgreen'} iconTint={'green'} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={headerConfig}>{title}</Text>
                <Text style={[paratextConfig, { marginTop: 5 }]} numberOfLines={1}>
                  {statusLabel(order?.deliveryStatus ?? order?.status)}
                  {description ? ` · ${description}` : ''}
                </Text>
              </View>
            </View>
          </View>
          <Ionicons name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} color={theme.buttonText} size={20} />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.detailsContainer}>
            <Row label="Order ID" value={order?.orderId ? `#${order.orderId}` : null} />

            {!!driverName && (
              <View style={{ marginVertical: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={paratextConfig}>Delivery Partner</Text>
                    <Text style={valueConfig} numberOfLines={1}>
                      {driverName}{driverPhone ? `, ${driverPhone}` : ''}
                    </Text>
                  </View>
                  {!!driverPhone && (
                    <TouchableOpacity onPress={() => callNumber(driverPhone)} style={{ borderRadius: 16, backgroundColor: theme.primary, paddingVertical: 6, paddingHorizontal: 12 }}>
                      <Text style={[paratextConfig, { color: theme.buttonText }]}>Call now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            <Row label="Receiver" value={receiver ? `${receiver}${receiverPhone ? `, ${receiverPhone}` : ''}` : null} />
            <Row label="Delivery Address" value={order?.deliveryAddress} />
            <Row label="Order Placed" value={formatOrderTime(order?.orderDate)} />
            <Row label="Estimated Delivery" value={order?.eta ? String(order.eta) : null} />

            <OrderTimeline order={order} />

            {!!order?.orderId && (
              <TouchableOpacity onPress={openFullTracking} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                <Text style={[paratextConfig, { color: theme.primary, fontFamily: Fonts.family.semiBold }]}>
                  View full tracking →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default OrderTracking;

const styles = StyleSheet.create({
  cardContainer: {
    overflow: 'hidden',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 12,
    margin: 10,
    marginTop: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  detailsContainer: { marginTop: 10, paddingHorizontal: 10 },
  innerRow: { flexDirection: 'row', alignItems: 'center' },
});
