import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
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

    const status =
      item.status === "Cancelled"
        ? "C"
        : item.status === "Completed"
          ? "CO"
          : "P";

    return (
      <OrderItem
        status={status}
        amount={item.amount}
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
    <View style={[styles.container, { backgroundColor: theme.secondaryBackground }]}>

      <TopAppBar navigation={navigation} title="My Orders" />

      {orderHistoryList.isLoading && (
        <AppLoading isVisible={orderHistoryList.isLoading} />
      )}

      {/* FILTER BAR */}
      <View style={styles.filterContainer}>

        <Text style={styles.filterLabel}>
          {getFilterLabel()}
        </Text>

        {selectedMonth ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedMonth(null);
              setSelectedYear(null);
            }}
          >
            <Text style={styles.clearText}>Clear Filter</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.changeText}>Change Month</Text>
          </TouchableOpacity>
        )}




      </View>

      {/* TOTAL ORDERS */}
      <Text
        style={{
          color: theme.greyText,
          fontFamily: Fonts.family.regular,
          fontSize: Fonts.size.base,
          paddingLeft: 16,
          marginBottom: 5
        }}
      >
        Total Orders : {filteredOrders.length}
      </Text>

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
            paddingBottom: insets.bottom + 20
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
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../../../assets/images/no_order.jpg')}
                style={styles.emptyImage}
                resizeMode="contain"
              />

              <Text style={[styles.emptyTitle, { color: theme.greyText }]}>
                No Orders Yet
              </Text>

              <Text style={[styles.emptySubtitle, { color: theme.secondaryText }]}>
                Your orders will appear here once you place one.
              </Text>
            </View>
          )}
        />
      )}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>Select Month</Text>

            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.monthItem}
                  onPress={() => {
                    setSelectedMonth(index);
                    setSelectedYear(new Date().getFullYear());
                    setShowPicker(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPicker(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
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
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 10
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#eee"
  },

  activeFilter: {
    backgroundColor: "#d7e7ff"
  },

  filterText: {
    fontWeight: "600"
  },

  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 6
  },

  clearText: {
    color: "red",
    fontWeight: "600"
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600"
  },

  changeButton: {
    backgroundColor: "#3274CC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },

  changeText: {
    color: "#fff"
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },

  modalCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    padding: 20
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },

  monthItem: {
    paddingVertical: 10
  },

  closeButton: {
    marginTop: 10,
    alignItems: "center"
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120
  },

  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 10
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10
  },

  emptySubtitle: {
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 40
  }

});