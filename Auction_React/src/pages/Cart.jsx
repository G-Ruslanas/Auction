import React from "react";
import Navbar from "../components/Navbar";

const Cart = () => {
  return (
    <div className="cart">
      <div className="cart_info">
        <div className="cart_product">
          <div className="cart_image">
            <img
              src="https://addons.prestashop.com/1390804-pbig/auction-pro-online-auctions-bidding.jpg"
              alt="image"
              className="image"
            />
          </div>
          <div className="cart_details">
            <span>
              <b>Title:</b> Title
            </span>
            <span>
              <b>ID:</b> ID
            </span>
            <span>
              <b>Category:</b> Category
            </span>
            <span>
              <b>Description:</b> Description
            </span>
            <span>
              <b>Price:</b> Price
            </span>
          </div>
        </div>
      </div>
      <div className="cart_summary">
        <h1>ORDER SUMMARY</h1>
        <div className="cart_item">
          <span>Estimated Shipping</span>
          <span>$ 5.0</span>
        </div>
        <div className="cart_item">
          <span>Shipping Discount</span>
          <span>$ -5.0</span>
        </div>
        <div className="cart_item">
          <span>
            <b>Total</b>
          </span>
          <span>$ 10</span>
        </div>
        <button className="cart_button">Purchase</button>
      </div>
    </div>
  );
};

export default Cart;
