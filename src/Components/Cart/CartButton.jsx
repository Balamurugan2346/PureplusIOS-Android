import Fonts from '../../../assets/fonts/Fonts';
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppContext } from "../../Context/AppContext"; // your context
import { useTheme } from "../../Context/ThemeContext"; // your theme

export default function CartButton({ product ,navigation}) {
  const { addToCart, reduceQuantity, removeFromCart, cart } = useAppContext();
  const { theme } = useTheme();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const added = quantity > 0;

  // Animated width value


  const width = useSharedValue(added ? "47%" : "82%");

  const viewCartWidth = useSharedValue(added ? '50%' : '15%')


  const headerConfig = {
    color: theme.background,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const paratextConfig = {
    color: theme.secondaryText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs
  }

  useEffect(() => {
    width.value = withTiming(added ? '47%' : '82%', {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    viewCartWidth.value = withTiming(added ? '50%' : '15%', {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [added]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const animatedCartButtonStyle = useAnimatedStyle(() => ({
    width: viewCartWidth.value,
  }));
  const handleAdd = () => {
    addToCart(product);
  };

  const handleIncrement = () => {
    addToCart(product);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      reduceQuantity(product);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Cart Icon */}

      <Animated.View style={[styles.cartBtn, animatedCartButtonStyle]}>
        <TouchableOpacity onPress={()=>navigation.navigate('CartScreen')} style={{ flexDirection: "row", alignItems: "center" }} activeOpacity={0.8}>
          <View>
            <Image
              source={require("../../../assets/images/cart.png")}
              style={styles.cartIcon}
              tintColor={"white"}
            />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
          </View>
          {added && (
            <View>
              <Text style={[headerConfig, { color: theme.buttonText, marginLeft: 6 }]}>View Cart</Text>
            </View>

          )}
        </TouchableOpacity>
      </Animated.View>


      {/* Main Animated Button */}
      <Animated.View style={[styles.mainBtn, animatedStyle]}>
        {!added ? (
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            <Text style={styles.addText}>Add to cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              onPress={handleDecrement}
              style={styles.qtyBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNumber}>{quantity}</Text>
            <TouchableOpacity
              onPress={handleIncrement}
              style={styles.qtyBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    marginHorizontal: 7,
    alignItems: "center",
  },
  cartBtn: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginRight: 10,
    position: "relative",
  },
  cartIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  badge: {
    position: "absolute",
    right:-8,
    top:-9,
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  mainBtn: {
    height: 50,
    borderRadius: 12,
    overflow: "visible",
  },
  addBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  qtyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ff4d6d",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  qtyBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  qtyNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
