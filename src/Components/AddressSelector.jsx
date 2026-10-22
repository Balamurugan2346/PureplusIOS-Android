import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AddressBar from './AddressBar';
import BottomSheet from './BottomSheet';
import AddressScreen from '../Screens/Address/AddressScreen';
import { getAddressList } from '../Redux/Slices/AddressSlice';
import { getSelectedAddressId } from '../Utils/GetSelectedAddress';

/**
 * Reusable delivery-address selector. Shows the currently selected address in an
 * AddressBar (with the dropdown chevron); tapping it opens the shared AddressScreen
 * sheet to pick / change / add an address. Self-contained — the sheet is hosted in a
 * full-screen Modal so this works anywhere (inside a NavScreen/ScrollView too).
 *
 * Props:
 *   navigation  — passed through to AddressScreen (needed for "Add new" → map)
 *   onChange    — (addressObj|null, addressId) called whenever the selection resolves
 *   style       — optional style for the AddressBar
 *   placeholder — text shown when nothing is selected (default "Select a delivery address")
 */
const AddressSelector = ({ navigation, onChange, style, placeholder = 'Select a delivery address' }) => {
  const dispatch = useDispatch();
  const addressList = useSelector((s) => s.address?.addressList ?? []);
  const [showSheet, setShowSheet] = useState(false);
  const [selectedAddr, setSelectedAddr] = useState(null);

  // Keep onChange in a ref so it doesn't re-trigger the resolve effect each render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const resolve = useCallback(async () => {
    const id = await getSelectedAddressId();
    const match = (addressList || []).find((a) => String(a?.id) === String(id)) || null;
    setSelectedAddr(match);
    if (onChangeRef.current) onChangeRef.current(match, id);
  }, [addressList]);

  useEffect(() => { dispatch(getAddressList()); }, [dispatch]);
  useEffect(() => { resolve(); }, [addressList, showSheet, resolve]);

  const addressText = selectedAddr
    ? `${selectedAddr.addressLine1 ?? ''} ${selectedAddr.addressLine2 ?? ''}`.trim() || placeholder
    : placeholder;

  return (
    <>
      <AddressBar address={addressText} onClick={() => setShowSheet(true)} style={style} />

      <Modal visible={showSheet} transparent animationType="fade" onRequestClose={() => setShowSheet(false)}>
        <BottomSheet visible={showSheet} onClose={() => setShowSheet(false)}>
          <AddressScreen
            navigation={navigation}
            onClose={() => { setShowSheet(false); resolve(); }}
            callGetSelectedAddressCallBack={() => { dispatch(getAddressList()); resolve(); }}
          />
        </BottomSheet>
      </Modal>
    </>
  );
};

export default AddressSelector;
