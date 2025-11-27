import { createContext, useContext, useEffect, useState } from 'react';

import { Dimensions } from 'react-native';
import Products from '../Data/DummyProducts';
import suggestedWarehouses from '../Data/SuggestionSuppliersList';
import WarehouseDatas from '../Data/WarehouseList';
import ProductModel from '../Model/Product/ProductsModel';
import { getData } from '../OfflineStore/OfflineStore';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isDialogVisibleAtOnce, setIsDialogVisibleAtOnce] = useState(false);
  const [products, setProducts] = useState(Products)
  const [cart, setCart] = useState([])
  const [myOrders, setMyOrders] = useState(ProductModel)
  const [warehouses, setWareHouses] = useState(WarehouseDatas)
  const [suggestedWarehouseList, setSuggestedWareHouseList] = useState(suggestedWarehouses)

  const {height} = Dimensions.get('window')

 const [usersAddress, setUsersAddress] = useState(null);

 const [currentLocation,setCurrentLocation] = useState({
  lat:0.0,
  long:0.0,
 })

 //some times the screen dont have bottom bar at that time we need to do something in ui so we track this state
 const [isBottomBarVisible,setIsBottomBarVisible] = useState(false)
 

 ///FETCHING STORED ADDRESS
   useEffect(() => {
     const fetchAddress = async () => {
       const savedAddress = await getData('UsersCurrentAddress');
       console.log('addressssssssss', savedAddress);
       setUsersAddress(savedAddress);
     };
     fetchAddress();
   }, []);


  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex !== -1) {
        // Product exists → increment quantity
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 3,
        };
        return updatedCart;
      } else {
        // Product does not exist → add as new item
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice:product.oldPrice,
            img: product.img,
            quantity: 3,
          }
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      return prevCart.filter(item => item.id !== productId);
    });
  };


  const reduceQuantity = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        const currentQty = updatedCart[existingIndex].quantity;

        if (currentQty > 3) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: currentQty - 3,
          };
          return updatedCart;
        } else {
          // Remove item completely
          return updatedCart.filter((_, i) => i !== existingIndex);
        }
      }
      return prevCart; // product not found
    });
  };


   


  return (
    <AppContext.Provider value={{
      isDialogVisibleAtOnce,
      setIsDialogVisibleAtOnce,
      products,
      setProducts,
      usersAddress,
      setUsersAddress,
      cart,
      setCart,
      addToCart,
      reduceQuantity,
      removeFromCart,
      warehouses,
      setWareHouses,
      isBottomBarVisible,
      setIsBottomBarVisible,
      suggestedWarehouseList,
      height,
      currentLocation,
      setCurrentLocation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
