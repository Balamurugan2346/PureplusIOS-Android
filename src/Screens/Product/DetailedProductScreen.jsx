import AppNavButton from '../../Components/AppNavButton';
import BottomSheet from '../../Components/BottomSheet';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartButton from '../../Components/Cart/CartButton';
import PerksUI from '../../Components/GlassyPerksContainer';
import AddressScreen from '../../Screens/Address/AddressScreen';
import ImageWithTitleDesc from '../../Components/Product/ImageWithTitleDesc';
import IconWithFeatures from '../../Components/Product/IconWithTextFeatures';
import { WaterFeatures } from '../../Data/waterFeaturesData';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
import { useDispatch, useSelector } from 'react-redux';
import { loadCartItems } from '../../Redux/Slices/CartSlice';
import ProductImages from '../../Components/Product/ProductImages';
import { filterValidImageUris } from '../../Utils/productImage';
import AppText from '../../Components/AppText';
import Card from '../../Components/Card';
import { fontFamily, radius, spacing } from '../../Themes/Themes';

const DetailedProductScreen = ({ navigation, userID }) => {
  const route = useRoute();
  const { product } = route.params;

  const insets = useSafeAreaInsets();

  useAppContext();
  useSelector((state) => state.cart);
  const { theme } = useTheme();

  const dispatch = useDispatch();

  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false);
  const { addressList } = useSelector((state) => state.address);
  const { currentLocationFormattedAddress } = useSelector((state) => state.locations);
  const { profileData } = useSelector((state) => state.profile);
  const [refreshing, setRefreshing] = useState(false);

  const displayTrimmedAddress = (usersAddress) => {
    if (usersAddress) {
      return usersAddress.length > 40 ? usersAddress.substring(0, 40) + '...' : usersAddress;
    }
    return 'Please choose address';
  };

  const handleRefresh = () => {
    dispatch(loadCartItems(userID));
  };

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [receiversDetails, setReceiversDetails] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getAddressFromStateList = async () => {
    const id = await getSelectedAddressId();
    if (!addressList?.length) return;
    const matched = addressList.find((addr) => addr.id == id);
    if (matched) {
      setSelectedAddress(`${matched.addressLine1 ?? ''} ${matched.addressLine2 ?? ''}`.trim());
      setReceiversDetails({
        receiverName: matched.receiverName ?? '',
        receiverNumber: matched.receiverNumber ?? '',
      });
    } else {
      setSelectedAddress(null);
      setReceiversDetails(null);
    }
  };

  const isOrderForSelf = (() => {
    if (!receiversDetails) return true;
    const receiverName = receiversDetails.receiverName?.trim().normalize('NFC').toLowerCase();
    const profileName = profileData?.fullName?.trim().normalize('NFC').toLowerCase();
    if (receiversDetails.receiverNumber?.trim()) return false;
    return receiverName === profileName;
  })();

  const displayReceiverName = isOrderForSelf
    ? profileData?.fullName
    : receiversDetails?.receiverName || profileData?.fullName;

  useEffect(() => {
    getAddressFromStateList();
  }, [currentLocationFormattedAddress]);

  useEffect(() => {
    console.log('selectedAddress:', selectedAddress);
  }, [selectedAddress]);

  const Field = ({ label, value, price }) => (
    <View style={styles.field}>
      <AppText variant="caption" color={theme.inkMuted}>{label}</AppText>
      <AppText variant={price ? 'price' : 'bodyStrong'} color={theme.ink} numberOfLines={1}>{value}</AppText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* GALLERY */}
        <View style={[styles.gallery, { backgroundColor: theme.sky200, paddingTop: insets.top }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(event) => {
              const slideSize = event.nativeEvent.layoutMeasurement.width;
              const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
              setActiveIndex(index);
            }}
          >
            <ProductImages imageUrls={product?.imageUrls} />
          </ScrollView>

          <View style={styles.dots}>
            {Array.from({ length: Math.max(1, filterValidImageUris(product?.imageUrls).length) }).map((_, index) => (
              <View
                key={index}
                style={activeIndex === index ? [styles.dotActive, { backgroundColor: theme.primary }] : [styles.dot, { backgroundColor: theme.surfaceCard }]}
              />
            ))}
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* Info Card */}
          <Card>
            <View style={styles.nameRow}>
              <AppText variant="price" color={theme.ink} style={styles.name}>{product.name}</AppText>
              <TouchableOpacity onPress={() => setShowAddressBottomSheet(true)} style={[styles.changeBtn, { borderColor: theme.borderSubtle }]} activeOpacity={0.8}>
                <AppText style={{fontSize:12}} variant="label" color={theme.ink}>{selectedAddress ? 'Change Address' : 'Add Address'}</AppText>
              </TouchableOpacity>
            </View>

            <View style={[styles.packChip, { backgroundColor: theme.primaryTint }]}>
              <Ionicons name="cube-outline" size={14} color={theme.primary} />
              <AppText variant="caption" color={theme.primary}>1 unit = {product.unitCount} water cans</AppText>
            </View>

            <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 6 }}>Cans are sold by the unit, not one at a time.</AppText>

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            <View style={styles.grid}>
              <Field label="MRP (incl. of all taxes)" value={`₹${product.basePrice}`} />
              <Field label="Unit price" value={`₹${product.unitPrice}`} price />
              {selectedAddress && <Field label="Receiver's name" value={displayReceiverName} />}
              {selectedAddress && <Field label="Receiver's address" value={displayTrimmedAddress(selectedAddress)} />}
            </View>
          </Card>

          <PerksUI />

          <ImageWithTitleDesc />

          <Card>
            {WaterFeatures.map((feature, index) => (
              <View key={index} style={index > 0 ? { marginTop: spacing.lg } : null}>
                <IconWithFeatures iconName={feature.iconName} title={feature.header} description={feature.body} />
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* Floating back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.back, { top: insets.top + 10 }]}>
        <AppNavButton color={theme.ink} />
      </TouchableOpacity>

      <CartButton navigation={navigation} product={product} />

      <BottomSheet visible={showAddressBottomSheet} onClose={() => setShowAddressBottomSheet(false)}>
        <AddressScreen
          navigation={navigation}
          callGetSelectedAddressCallBack={() => {}}
          onClose={() => setShowAddressBottomSheet(false)}
        />
      </BottomSheet>
    </View>
  );
};

export default DetailedProductScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  gallery: {
    height: 320,
    width: '100%',
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dots: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 6, position: 'absolute', bottom: 16 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { width: 20, height: 6, borderRadius: 3 },
  back: { position: 'absolute', left: 16, zIndex: 10 },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.xl, gap: spacing.lg },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  name: { flex: 1, fontSize: 22, lineHeight: 28, fontWeight: '600' },
  changeBtn: { borderWidth: 1.5, borderRadius: radius.pill, paddingHorizontal: spacing.md, height: 30, alignItems: 'center', justifyContent: 'center' },
  packChip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill, marginTop: spacing.md },
  divider: { height: 1, marginVertical: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  field: { width: '50%', paddingVertical: 6, paddingRight: spacing.sm, gap: 2 },
});
