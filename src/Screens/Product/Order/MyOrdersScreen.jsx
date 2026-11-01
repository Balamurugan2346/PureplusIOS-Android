import { useTheme } from '../../../Context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderItem from '../../../Components/OrderItem';
import TopAppBar from '../../../Components/TopAppBar';
import AppText from '../../../Components/AppText';
import { radius, spacing, floatShadow } from '../../../Themes/Themes';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllOrders } from '../../../Redux/Slices/OrderSlice';
import { Modal } from "react-native";
import AppLoading from '../../../Components/AppLoading';

const MyOrdersScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const { orderHistoryList } = useSelector((state) => state.order);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const orders = Array.isArray(orderHistoryList?.data)
    ? orderHistoryList.data
    : [];

  useEffect(() => {
    dispatch(getAllOrders({}));
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */

  const getFilterLabel = () => {
    if (selectedMonth === null && selectedYear === null) {
      return "All Orders";
    }

    if (selectedMonth !== null && selectedYear !== null) {
      return `${months[selectedMonth]} ${selectedYear}`;
    }

    if (selectedYear !== null) {
      return `Year ${selectedYear}`;
    }

    return "Filtered Orders";
  };

  const filteredOrders = orders?.filter(order => {

    if (selectedMonth === null && selectedYear === null) return true;

    const orderDate = new Date(order.date);

    const monthMatch =
      selectedMonth !== null
        ? orderDate.getMonth() === selectedMonth
        : true;

    const yearMatch =
      selectedYear !== null
        ? orderDate.getFullYear() === selectedYear
        : true;

    return monthMatch && yearMatch;
  }) || [];

  /* ---------------- REFRESH ---------------- */

  const handleRefresh = async () => {

    setRefreshing(true);

    setSelectedMonth(null);
    setSelectedYear(null);

    await dispatch(getAllOrders({}));

    setRefreshing(false);
  };

  /* ---------------- ITEM RENDER ---------------- */

  const renderItem = ({ item }) => {
    // Pass the real backend order_status straight through (OrderItem maps it to a label/colour).
    // Amount = collect-at-door (payable + refundable deposit); fall back to the old amount until
    // the backend field ships.
    return (
      <OrderItem
        status={item.status}
        amount={item.collectAtDoor ?? item.amount}
        date={item.date}
        images={item.imageUrls}
        onItemClick={() =>
          navigation.navigate("OrderDetailedScreen", { id: item.orderId })
        }
      />
    );
  };

  /* ---------------- FILTER UI ---------------- */

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>

      <TopAppBar navigation={navigation} title="My Orders" />

      {orderHistoryList.isLoading && (
        <AppLoading isVisible={orderHistoryList.isLoading} />
      )}

      {/* FILTER BAR */}
      <View style={styles.filterContainer}>

        <View style={{ flex: 1 }}>
          <AppText variant="title" color={theme.ink}>{getFilterLabel()}</AppText>
          <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
            Total Orders: {filteredOrders.length}
          </AppText>
        </View>

        {selectedMonth ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedMonth(null);
              setSelectedYear(null);
            }}
          >
            <AppText variant="label" color={theme.danger}>Clear Filter</AppText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.changeButton, { backgroundColor: theme.primaryTint }]}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="calendar-outline" size={16} color={theme.primary} />
            <AppText variant="label" color={theme.primary} style={{ marginLeft: 6 }}>Change Month</AppText>
          </TouchableOpacity>
        )}

      </View>

      {/* ORDER LIST */}

      {!orderHistoryList.isLoading && filteredOrders && filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.primary]}
            />
          }
          contentContainerStyle={{
            paddingBottom: insets.bottom + 110
          }}
        />
      ) : (
        <FlatList
          data={[]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.primary]}
            />
          }
          contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm }}
          ListEmptyComponent={() => (
            <View style={[styles.emptyCard, { backgroundColor: theme.surfaceCard }]}>
              <Image
                source={require('../../../../assets/images/no_order.jpg')}
                style={styles.emptyImage}
                resizeMode="contain"
              />

              <AppText variant="title" color={theme.ink} style={{ marginTop: spacing.md }}>
                No Orders Yet
              </AppText>

              <AppText variant="caption" color={theme.inkMuted} style={styles.emptySubtitle}>
                Your orders will appear here once you place one.
              </AppText>
            </View>
          )}
        />
      )}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity activeOpacity={1} style={[styles.sheetOverlay, { backgroundColor: theme.scrim }]} onPress={() => setShowPicker(false)}>
          <TouchableOpacity activeOpacity={1} style={[styles.sheet, { backgroundColor: theme.surfaceCard }, floatShadow]}>

            <View style={[styles.grabHandle, { backgroundColor: theme.borderSubtle }]} />

            <AppText variant="title" color={theme.ink} style={{ marginBottom: spacing.lg }}>Select Month</AppText>

            <View style={styles.monthGrid}>
              {months.map((item, index) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.monthChip, { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle }]}
                  onPress={() => {
                    setSelectedMonth(index);
                    setSelectedYear(new Date().getFullYear());
                    setShowPicker(false);
                  }}
                >
                  <AppText variant="label" color={theme.ink}>{item.slice(0, 3)}</AppText>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.closeButton, { borderColor: theme.borderStrong }]}
              onPress={() => setShowPicker(false)}
            >
              <AppText variant="button" color={theme.ink}>Close</AppText>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },

  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },

  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    height: 36,
    borderRadius: radius.pill,
  },

  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  grabHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },

  monthChip: {
    width: '30%',
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  closeButton: {
    marginTop: spacing.xl,
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    paddingVertical: 40,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },

  emptyImage: {
    width: 96,
    height: 96,
  },

  emptySubtitle: {
    marginTop: 4,
    textAlign: "center",
  }

});