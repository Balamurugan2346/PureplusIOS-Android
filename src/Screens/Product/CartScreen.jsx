import BottomSheet from '../../Components/BottomSheet';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartItem from '../../Components/Cart/CartItem';
import EstimateSummary from '../../Components/Cart/EstimateSummary';
import EmptiesReturnSelector from '../../Components/Cart/EmptiesReturnSelector';
import PaymentWithAddressBar from '../../Components/Cart/PayButtonWithAddressBar';
import PaymentSection from '../../Components/Cart/PaymentSection';
import TopAppBar from '../../Components/TopAppBar';
import AppText from '../../Components/AppText';
import { radius, spacing } from '../../Themes/Themes';
import ViewCoupon from '../../Components/ViewCoupon';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import AddressScreen from '../Address/AddressScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useUserId } from '../../customHooks/useUserID'
import { clearCart, loadCartItems, addToCart, updateCart } from '../../Redux/Slices/CartSlice';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
import { getOrderDetailed, placeOrder } from '../../Redux/Slices/OrderSlice'
import { useToast } from '../../Components/Toast/ToastProvider';
import AppLoading from '../../Components/AppLoading';
import { clearSheduleSlots } from '../../Redux/Slices/SheduleOrderSlice';
import { resolveServiceability } from '../../Redux/Slices/ServiceabilitySlice';
import CheckoutService from '../../API/modules/CheckoutService';
import OrderService from '../../API/modules/OrderService';
import CartService from '../../API/modules/CartService';
const CartScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isBottomBarVisible } = useAppContext()
  const { cartItems, loading: cartLoading, error: cartError, isFetched: cartIsFetched } = useSelector((state) => state.cart)
  //ADDRESS LIST
  const { addressList, selectedAddress: selectedAddressGlobalState } = useSelector((state) => state.address)
  //PRODUCTS (for per-product taxPercent needed by the checkout estimate)
  const { productList } = useSelector((state) => state.products)


  const { showToast } = useToast()
  //selected slots or instant
  const { selectedSlot } = useSelector((state) => state.sheduleOrder)
  //serviceability of the selected delivery address (CUS-07) — blocks ordering when false
  const { serviceable, reason: svcReason } = useSelector((state) => state.serviceability)

  //LOCATIONS + GEOCODING API DATA  
  const { error: LocationError, display_name, address: DetailedAddress, isFetched: isLocationApiFetched, currentLocationAddressFetched, currentLocationFormattedAddress, entireGEOData, loading: isGEOcodingApiLoading } = useSelector((state) => state.locations)
  const { theme } = useTheme()
  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false)
  //USER PROFILE
  const { error: ProfileError, loading: profileLoading, isFetched: isProfileApiFetched, profileData } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const { userId, loading: userIDLoading } = useUserId();

  const { placeOrder: { isLoading: placeOrderLoading, error: placeOrderError } , orderDetailed } = useSelector((state) => state.order)

  const headerConfig = {
    color: theme.greyText,
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.base
  }

  const paratextConfig = {
    color: theme.secondaryText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs
  }


  const [selectedAddress, setSelectedAddress] = useState(null);
  const [receiversDetails, setReceiversDetails] = useState(null);
  const [forSomeoneElse, setForSomeoneElse] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  // CUS-12 checkout estimate + first-order offer
  const [selectedAddressObj, setSelectedAddressObj] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState(null);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  // CUS-12 empties-return: how many held empties the customer will hand over on THIS order.
  // Defaults to 0 (assume none returned → full deposit); the customer raises it up to the cans they
  // hold (estimate.depositHeldCans), or taps "Return all". Always sent to the estimate.
  const [emptiesReturned, setEmptiesReturned] = useState(0);
  //  useState({
  //   receiverName:'',
  //   receiverNumber:'',
  //   receiversAddress:''
  // })

  useEffect(()=>{

    console.log("estimate",estimate)
  },[estimate])

  const getAddressFromStateList = async () => {
    const id = await getSelectedAddressId();

    if (!addressList?.length) return;

    const matched = addressList.find(addr => addr.id == id);

    if (matched) {
      setSelectedAddress(
        `${matched.addressLine1 ?? ''} ${matched.addressLine2 ?? ''}`.trim()
      );
      // Keep the full address object — the checkout estimate needs its id/floor/lift.
      setSelectedAddressObj(matched);

      setReceiversDetails({
        receiverName: matched.receiverName ?? '',
        receiverNumber: matched.receiverNumber ?? '',
      });

      // Re-check serviceability for the address the order will actually go to.
      const pin = matched.pincode ?? matched.pinCode ?? matched.pin_code;
      if (pin) dispatch(resolveServiceability(String(pin).trim()));
    } else {
      // setSelectedAddress(currentLocationFormattedAddress ?? null); no need to store location part in address
      setSelectedAddress(null)
      setSelectedAddressObj(null);
      setReceiversDetails(null);
    }
  };

  // Per-product GST% for the estimate items (cart rows don't carry it; look it up from the catalog).
  const taxFor = (productId) => {
    const catalogList = Array.isArray(productList) ? productList : (productList?.data ?? []);
    const p = catalogList.find((x) => x.productId === productId);
    return Number(p?.taxPercent ?? p?.taxPercentage ?? 0) || 0;
  };

  // CUS-12: fetch the live price breakdown. Business rule — only call the API when a
  // delivery address is actually selected; otherwise clear any stale estimate.
  const fetchEstimate = async () => {
    const addr = selectedAddressObj;
    console.log("addr",addr)
    console.log("cartitems",cartItems)
    if (!addr || !(Number(addr.id) > 0)) { setEstimate(null); setEstimateError(null); return; }
    if (!cartItems || cartItems.length === 0) { setEstimate(null); setEstimateError(null); 
      return; 
    }

   
    const items = cartItems.map((ci) => ({
      productId: ci.productId,
      quantity: ci.quantity,          // 1 quantity = 1 unit
      unitPrice: Number(ci.price) || 0,
      // Real per-product GST% from the cart API (CartItemResponse.taxPercentage); fall back to the
      // catalog lookup, then 0. No more hardcoded 18.
      taxPercent: Number(ci.taxPercentage ?? taxFor(ci.productId)) || 0,
    }));

    const payload = {
      addressId: Number(addr.id),
      floor: Number(addr.floorNo ?? addr.floor ?? 0) || 0,
      hasLift: !!(addr.lift ?? addr.hasLift),
      isFirstOrder: !!isFirstOrder,
      items,
      // Customer's declared empties for this order (default 0 = none returned). Backend clamps to [0, heldCans].
      emptiesReturned: Number(emptiesReturned) || 0,
    };

    console.log("payload",payload)
    try {
      setEstimateLoading(true);
      setEstimateError(null);
      const data = await CheckoutService.estimate(payload);
      setEstimate(data);
    } catch (e) {
      setEstimate(null);
      setEstimateError(e?.message || 'Could not fetch the price estimate.');
    } finally {
      setEstimateLoading(false);
    }
  };

  const isOrderForSelf = (() => {
    if (!receiversDetails) return true;

    const receiverName = receiversDetails.receiverName
      ?.trim()
      .normalize("NFC")
      .toLowerCase();

    const profileName = profileData?.fullName
      ?.trim()
      .normalize("NFC")
      .toLowerCase();

    if (receiversDetails.receiverNumber?.trim()) return false;

    console.log("receiverName:", `"${receiverName}"`);
    console.log("profileName:", `"${profileName}"`);
    console.log("name match", receiverName === profileName);

    return receiverName === profileName;
  })();



  const displayReceiverName = isOrderForSelf
    ? profileData?.fullName
    : receiversDetails?.receiverName || profileData?.fullName;

  // Delivery schedule summary (CUS-13): an order is "scheduled" only when the slot
  // carries both a type of 'scheduled' AND a date — otherwise it's instant.
  const isScheduledSlot = selectedSlot?.type === 'scheduled' && !!selectedSlot?.date;

  // 'YYYY-MM-DD' → a readable "Mon, 14 Oct". Falls back to the raw string if unparseable.
  const formatSlotDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  };



  const synCCart = () => {
    // dispatch(clearCart()) no need its weird when seeing white screen when syncing even there is data 
    dispatch(loadCartItems(userId))
  }

  //API CALL
  useEffect(() => {
    if (!userIDLoading) {
      synCCart()
    }
  }, [userIDLoading])


  useEffect(() => {
    getAddressFromStateList()
  }, [currentLocationFormattedAddress, addressList, selectedAddressGlobalState])

  // First-order check — drives the complimentary-can offer and the estimate's isFirstOrder flag.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const r = await OrderService.isFirst();
        if (active) setIsFirstOrder(!!r?.isFirstOrder);
      } catch (e) { /* non-blocking; default stays false */ }
    })();
    return () => { active = false; };
  }, [])

  // Re-price whenever the cart, the selected address, first-order status, or the
  // customer's chosen empties-to-return changes.
  useEffect(() => {
    fetchEstimate();
  }, [selectedAddressObj?.id, cartItems, isFirstOrder, emptiesReturned])

  // Keep the chosen empties within the swap cap (min of held cans and cans delivered this order).
  // If the cart shrinks so fewer cans are delivered, auto-reduce the return so it never exceeds it.
  useEffect(() => {
    const delivered = (estimate?.items || []).reduce(
      (a, i) => a + (Number(i.deliveredCans) || (Number(i.cansPerUnit) || 0) * (Number(i.quantity) || 0)),
      0,
    );
    const cap = Math.min(Number(estimate?.depositHeldCans ?? 0), delivered);
    if (Number(emptiesReturned) > cap) setEmptiesReturned(cap);
  }, [estimate])


  const handleRefresh = () => {
    setRefreshing(true);
    synCCart()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }


  const handleOrderDetails = (response) => {
    try {
      const orderId = response?.orderId;
      console.log("id", orderId)

      if (typeof orderId === 'number' && orderId > 0) {
        // Clear schedule slots
        dispatch(clearSheduleSlots());
        console.log("coming here")

        // Sync cart after placing order
        // dispatch(loadCartItems(-1));
        dispatch(
          getOrderDetailed({
            id: orderId,
            onSuccess: () => {
              navigation.navigate("OrderSuccess", { id: orderId });
            },
            onError: () => {
              showToast("Order placed!!");
            },
          })
        );


      } else {
        // Handle invalid or missing orderId
        showToast("Order placed but invalid ID received", true);
      }
    } catch (error) {
      // Catch unexpected parsing issues
      showToast("Unexpected error while processing order", true);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, paddingBottom: isBottomBarVisible ? 0 : insets.bottom }]}>

      {placeOrderLoading || orderDetailed.isLoading &&  (
        <AppLoading isVisible={placeOrderLoading  || orderDetailed.isLoading} />
      )}

      {/* topbar */}
      <TopAppBar title='My Cart' navigation={navigation} />



      {/* content */}
      {cartItems && cartItems.length > 0 ? (
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>

          {/* coupon ui */}
          {/* <ViewCoupon navigation={navigation} /> */}

          {/* delivery time card */}
          <View style={[styles.card, { backgroundColor: theme.surfaceCard, marginTop: spacing.lg }]}>
            {/* delivery time ui */}

            {/* Delivery-time row. The left block is a two-line vertical stack: a bold
                primary line (the delivery mode) and a secondary line carrying the detail —
                for a scheduled order that's the full date + slot time. The secondary line
                wraps to 2 lines instead of truncating, so the slot time is never clipped to
                a placeholder "…". The button stays flexShrink:0 so it can't be pushed off. */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 }}>
                <View style={{ backgroundColor: theme.successTint, borderRadius: 12, width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name='time' color={theme.success} size={24} />
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[headerConfig, { fontSize: Fonts.size.sm }]}>
                    {isScheduledSlot ? 'Scheduled delivery' : 'Deliver now'}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[paratextConfig, { marginTop: 2 }]}
                  >
                    {isScheduledSlot
                      ? `${formatSlotDate(selectedSlot.date)}${selectedSlot.label ? ` · ${selectedSlot.label}` : ''}`
                      : 'Instant · delivered within ~30 min'}
                  </Text>
                </View>
              </View>


              <Pressable onPress={() => {
                navigation.navigate('SheduleOrderScreen')
              }} style={{ backgroundColor: theme.warningTint, borderRadius: 999, borderWidth: 1.5, borderColor: theme.warning, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>

                <View style={{ flexDirection: "row", paddingHorizontal: 12, paddingVertical: 7, justifyContent: "center", alignItems: "center", gap: 4 }}>
                  <Ionicons name='time-outline' color={theme.warning} size={16} />
                  <Text style={[{ color: theme.warning, fontFamily: Fonts.family.medium, fontSize: 12 }]}>
                    {selectedSlot?.type === 'scheduled' ? 'Change' : 'Schedule'}
                  </Text>
                  <Ionicons name='chevron-forward' color={theme.warning} size={14} />
                </View>

              </Pressable>

            </View>
          </View>

          {/* cart items card */}
          <View style={[styles.card, { backgroundColor: theme.surfaceCard, marginTop: spacing.lg }]}>
            <View>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  cartItem={item}
                />
              ))}
            </View>
            <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: spacing.sm }}>Quantity is counted in units. Pack size per product is shown on each item.</AppText>
          </View>
          {/* {selectedAddress && ( */}
          <PaymentWithAddressBar displayName={displayReceiverName} receiversDetails={receiversDetails} isOrderForSelf={isOrderForSelf} address={selectedAddress} navigation={navigation} showBottomSheet={() => setShowAddressBottomSheet(true)} />
          {/* )} */}

          {/* empties-to-return selector (CUS-12) — only when the customer holds cans.
              Capped at the cans delivered in THIS order (a swap), never more: returning more than
              delivered is a net reduction = deposit refund, handled separately (My Cans). */}
          <EmptiesReturnSelector
            heldCans={Number(estimate?.depositHeldCans ?? 0)}
            maxReturn={Math.min(
              Number(estimate?.depositHeldCans ?? 0),
              (estimate?.items || []).reduce(
                (a, i) => a + (Number(i.deliveredCans) || (Number(i.cansPerUnit) || 0) * (Number(i.quantity) || 0)),
                0,
              ),
            )}
            value={Number(emptiesReturned) || 0}
            onChange={(v) => setEmptiesReturned(v)}
            disabled={estimateLoading}
          />

          {/* bill summary — live checkout estimate (CUS-12) */}
          <EstimateSummary
            estimate={estimate}
            loading={estimateLoading}
            error={estimateError}
            isFirstOrder={isFirstOrder}
            addressSelected={!!(selectedAddressObj && Number(selectedAddressObj.id) > 0)}
          />

          {/* payment button */}
          <PaymentSection navigation={navigation} payableTotal={estimate?.grandTotal} onPayClick={async (paymentMethod) => {
            const id = await getSelectedAddressId();
            console.log(selectedSlot?.id, "selected slot id from cart screen")
            if (id == -1 || id == null) {
              showToast("Please select an address to place order", true)
              return
            }
            // Don't even attempt placement for an unserviceable address (CUS-07). The
            // backend rejects it too, but this gives an immediate, clearer message.
            if (serviceable === false) {
              showToast(svcReason || "We don't deliver to this area yet. Please change the address.", true)
              return
            }
            // Min-order gate — the estimate already computed per-line min-order compliance.
            if (estimate && estimate.allMinimumsMet === false) {
              showToast("Minimum order not met. Please check the bill summary.", true)
              return
            }
            // CUS: validate every cart line against min-order / bulk rules before placing.
            try {
              for (const ci of cartItems) {
                const res = await CartService.validate({ productId: ci.productId, quantity: ci.quantity });
                if (res && res.bulkAllowed === false) {
                  showToast(`Product ${ci.productId}: this quantity isn't allowed.`, true)
                  return
                }
              }
            } catch (e) {
              showToast(e?.message || "Could not validate the cart. Please try again.", true)
              return
            }
            // Backend PlaceOrderRequest expects numeric ids; the cart items come
            // from the server-side cart, so only order-level fields go here.
            // Schedule vs instant (CUS-13): the backend only treats an order as
            // scheduled when deliveryType === "scheduled" AND slotId AND deliveryDate
            // are all present (CustomerCreateOrderAsync → order_type_id=2, expected
            // delivery = date + slot start). Otherwise it's instant (now + 30 min).
            // depositAmount is IGNORED server-side (deposit is computed there), so 0 is fine.
            // CUS-29: receiver fields added when ordering for someone else.
            const isScheduled = selectedSlot?.type === 'scheduled' && !!selectedSlot?.date;
            var data = {
              addressId: Number(id),
              deliveryType: isScheduled ? 'scheduled' : 'instant',
              slotId: isScheduled ? Number(selectedSlot?.id ?? 0) : null,
              deliveryDate: isScheduled
                ? new Date(selectedSlot.date).toISOString()
                : new Date().toISOString(),
              depositAmount: 0,
              paymentMode: paymentMethod,
              ...(forSomeoneElse && receiverName.trim() && {
                receiverName: receiverName.trim(),
                receiverPhone: receiverPhone.trim() || undefined,
              }),
            }
            console.log('PLACE ORDER BODY', data)
            dispatch(placeOrder({
              body: data,
              onSuccess: (response) => {
                handleOrderDetails(response)
              }, onError: (err) => {
                console.log("errr", err)
                // surface the backend's real reason (e.g. "We don't deliver to this area yet")
                const msg =
                  err?.response?.data?.message ||
                  err?.response?.data?.title ||
                  err?.message ||
                  "Failed to place order";
                showToast(msg, true)
              }
            }))
          }} />
        </ScrollView>
      ) : (
        cartIsFetched && (
          <View style={styles.emptyWrap}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.primaryTint }]}>
              <Ionicons name="cart-outline" size={32} color={theme.primary} />
            </View>
            <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: spacing.md }}>No items in the cart</AppText>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: theme.ink }]}
              onPress={() => navigation.goBack()}
            >
              <AppText variant="button" color={theme.onInk}>Go Back</AppText>
            </TouchableOpacity>
          </View>
        )

      )}

      {showAddressBottomSheet && <BottomSheet visible={showAddressBottomSheet} onClose={() => setShowAddressBottomSheet(false)}>
        <AddressScreen navigation={navigation} onClose={() => setShowAddressBottomSheet(false)} callGetSelectedAddressCallBack={()=>{
          //do nothing for now
        }} />
      </BottomSheet>
      }

    </View>

  );
};

export default CartScreen;

const styles = StyleSheet.create({


  topBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    height: "13%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },

  container: {
    flex: 1,
  },
  card: {
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  emptyWrap: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtn: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    marginTop: spacing.lg,
  },
});
