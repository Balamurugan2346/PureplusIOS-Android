// products.js
import ProductModel from "../Model/Product/ProductsModel";

const cartItems = [
  {
    ...ProductModel,
    id: 1,
    name: "Water Can 1 Litre",
    description: "Pure drinking water in 1 litre can",
    price: "₹10",
    oldPrice: "₹15",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=60",
    offerText: "Limited time offer!"
  },
  {
    ...ProductModel,
    id: 2,
    name: "Water Can 2 Litre",
    description: "Pure drinking water in 2 litre can",
    price: "₹20",
    oldPrice: "₹25",
    img: "",
    offerText: "Stay hydrated!"
  },
];

export default cartItems;
