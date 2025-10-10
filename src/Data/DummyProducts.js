// products.js
import ProductModel from "../Model/Product/ProductsModel";

const products = [
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
  {
    ...ProductModel,
    id: 3,
    name: "Water Can 3 Litre",
    description: "Pure drinking water in 3 litre can",
    price: "₹30",
    oldPrice: "₹35",
    img: "",
    offerText: "Best quality guaranteed"
  },
  {
    ...ProductModel,
    id: 4,
    name: "Water Can 4 Litre",
    description: "Pure drinking water in 4 litre can",
    price: "₹40",
    oldPrice: "₹45",
    img: "",
    offerText: "Fresh and clean!"
  },
  {
    ...ProductModel,
    id: 5,
    name: "Water Can 5 Litre",
    description: "Pure drinking water in 5 litre can",
    price: "₹50",
    oldPrice: "₹55",
    img: "",
    offerText: "Special discount!"
  },
  {
    ...ProductModel,
    id: 6,
    name: "Water Can 6 Litre",
    description: "Pure drinking water in 6 litre can",
    price: "₹60",
    oldPrice: "₹65",
    img: "",
    offerText: "Perfect for small families"
  },
  {
    ...ProductModel,
    id: 7,
    name: "Water Can 7 Litre",
    description: "Pure drinking water in 7 litre can",
    price: "₹70",
    oldPrice: "₹75",
    img: "",
    offerText: "Value pack!"
  },
  {
    ...ProductModel,
    id: 8,
    name: "Water Can 8 Litre",
    description: "Pure drinking water in 8 litre can",
    price: "₹80",
    oldPrice: "₹85",
    img: "",
    offerText: "Crystal clear water"
  },
  {
    ...ProductModel,
    id: 9,
    name: "Water Can 9 Litre",
    description: "Pure drinking water in 9 litre can",
    price: "₹90",
    oldPrice: "₹95",
    img: "",
    offerText: "Economical choice"
  },
  {
    ...ProductModel,
    id: 10,
    name: "Water Can 10 Litre",
    description: "Pure drinking water in 10 litre can",
    price: "₹100",
    oldPrice: "₹110",
    img: "",
    offerText: "Family pack!"
  },
];

export default products;
