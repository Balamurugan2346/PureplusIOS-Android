import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../Context/ThemeContext";
import Fonts from "../../../../assets/fonts/Fonts";

export default function OrderTimeline({ order }) {

  const { theme } = useTheme();

  const steps = [
    {
      key: "PENDING",
      title: "Order Placed",
      time: order?.createdAt
    },
    {
      key: "DELIVERY_ASSIGNED",
      title: "Delivery Partner Assigned",
      time: order?.assignedAt
    },
    {
      key: "COMPLETED",
      title: "Delivered",
      time: order?.completedAt
    }
  ];

  const statusIndex = steps.findIndex(
    (s) => s.key === order?.status
  );

  return (

    <View style={styles.container}>

      {steps.map((step, index) => {

        const completed = index <= statusIndex;

        return (

          <View key={index} style={styles.row}>

            {/* DOT + LINE */}

            <View style={styles.left}>

              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: completed
                      ? theme.primary
                      : "#ccc"
                  }
                ]}
              />

              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        index < statusIndex
                          ? theme.primary
                          : "#ddd"
                    }
                  ]}
                />
              )}

            </View>


            {/* TEXT */}

            <View style={styles.right}>

              <Text
                style={[
                  styles.title,
                  {
                    color: completed
                      ? theme.text
                      : theme.secondaryText
                  }
                ]}
              >
                {step.title}
              </Text>

              {step.time && (
                <Text style={styles.time}>
                  {new Date(step.time).toLocaleString()}
                </Text>
              )}

            </View>

          </View>

        );

      })}

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    marginHorizontal: 20,
    marginTop: 20
  },

  row: {
    flexDirection: "row"
  },

  left: {
    alignItems: "center",
    marginRight: 14
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: 10
  },

  line: {
    width: 2,
    flex: 1
  },

  right: {
    paddingBottom: 30
  },

  title: {
    fontSize: 14,
    fontFamily: Fonts.family.semiBold
  },

  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 4
  }

});