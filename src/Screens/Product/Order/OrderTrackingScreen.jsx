import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../Context/ThemeContext";
import Fonts from "../../../../assets/fonts/Fonts";
import TopAppBar from "../../../Components/TopAppBar";
import OrderTimeline from "./OrderTimeLine";
import { getOrderDetailed } from "../../../Redux/Slices/OrderSlice";

export default function OrderTrackingScreen({ route, navigation }) {

  const dispatch = useDispatch();
  const { theme } = useTheme();

  const orderId = route?.params?.id;

  const { data: order } = useSelector(
    (state) => state.order.orderDetailed
  );

  useEffect(() => {
    console.log("orderId",orderId)
    dispatch(
      getOrderDetailed({
        id: orderId,
        onSuccess: () => {},
        onError: () => {},
      })
    );

  }, []);


  return (

    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <TopAppBar
        navigation={navigation}
        title="Track Order"
      />

      <ScrollView>

        {/* ORDER CARD */}

        <View style={[styles.card, { backgroundColor: theme.card }]}>

          <Text style={[styles.title, { color: theme.text }]}>
            Order #{orderId}
          </Text>

          <Text style={[styles.subTitle, { color: theme.secondaryText }]}>
            {order?.deliveryAddress}
          </Text>

        </View>


        {/* TIMELINE */}

        <OrderTimeline order={order} />

      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2
  },

  title: {
    fontSize: 18,
    fontFamily: Fonts.family.bold
  },

  subTitle: {
    fontSize: 13,
    marginTop: 4
  }

});