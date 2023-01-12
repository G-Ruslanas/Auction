import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import StripeCheckout from "react-stripe-checkout";
import "./css/Cart.css";

const Cart = ({ user }) => {
  const [wonAuctions, setWonAuctions] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getWonAuctions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/winner/find/${user._id}`
        );
        setWonAuctions(res.data);
        let price = 0;
        for (let obj of res.data) {
          price = price + obj.purchase_price;
          setTotal(price);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getWonAuctions();
  }, [user._id, status]);

  const handleToken = async (token) => {
    const response = await axios.post("http://localhost:5000/stripe/checkout", {
      auctions: wonAuctions,
      total,
      token,
    });
    const { status } = response.data;
    if (status === "success") {
      for (const obj of wonAuctions) {
        await axios.put("http://localhost:5000/winner/paid", {
          id: obj._id,
        });
      }
      setStatus("Success!");
    } else {
      setStatus("Something went wrong!");
    }
  };

  return (
    <div className="cart">
      <div className="cart_wrapper">
        {wonAuctions.length !== 0 ? (
          wonAuctions.map((wonAuction, index) => {
            return (
              <React.Fragment key={index}>
                <div className="cart_info">
                  <div className="cart_product">
                    <div className="cart_image">
                      <img
                        src={`uploads/${wonAuction.img}`}
                        alt=""
                        className="cart_img"
                      />
                    </div>
                    <div className="cart_details">
                      <span>
                        <b>Title:</b> {wonAuction.title}
                      </span>
                      <span>
                        <b>ID:</b> {wonAuction._id}
                      </span>
                      <span>
                        <b>Category:</b> {wonAuction.category}
                      </span>
                      <span>
                        <b>Description:</b> {wonAuction.desc}
                      </span>
                      <span>
                        <b>Price:</b> {wonAuction.purchase_price}
                      </span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div className="cart_info">
            <h1 className="noWinAuction">No Won Auctions</h1>
          </div>
        )}
      </div>
      <div className="cart_summary">
        <h1 className="cart_order">ORDER SUMMARY</h1>
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
          <span>$ {total}</span>
        </div>
        {status && <Alert variant="info">{status}</Alert>}
        <StripeCheckout
          stripeKey="pk_test_51K1VS2IjqPb8FkRvICnfh27rAzMswXf2jGP2zBOUHW87sNfGMyI0fA8D0YFaclvMTLJcAFLjQij5hIbbHxw00aL800JJTQbv7B"
          className="cart_button"
          token={handleToken}
          billingAddress
          shippingAddress
          amount={total * 100}
        ></StripeCheckout>
      </div>
    </div>
  );
};

export default Cart;
