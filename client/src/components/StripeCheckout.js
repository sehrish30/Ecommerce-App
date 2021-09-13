import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import Laptop from "../images/laptop.jpg";

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const StripeCheckout = ({ history }) => {
  const dispatch = useDispatch();
  const { user, coupon } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [cartTotal, setCartTotal] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState("");
  const [payable, setPayable] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(user.token, coupon).then((res) => {
      console.log(res.data);
      setClientSecret(res.data.clientSecret);
      // additional response
      setCartTotal(res.data.cartTotal);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // make request to stripe to confirm card payment
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      // here you get result of successful payment
      // create order and save in database for admin to process
      // empty user cart from redux and localstorage
      console.log(JSON.stringify(payload, null, 4));
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };
  const handleChange = async (e) => {
    // listen for changes in the cart element
    // and display any errors as customer types their card details
    setDisabled(e.empty); // disable pay button if any errors
    setError(e.error ? e.error.message : "");
  };

  return (
    <>
      {!succeeded && (
        <div>
          {coupon && totalAfterDiscount ? (
            <p className="alert alert-success">
              {`Total after discount BD ${totalAfterDiscount}`}
            </p>
          ) : (
            <p className="alert alert-danger">No coupon applied</p>
          )}
        </div>
      )}
      <div className="text-center pb-5">
        <Card
          cover={
            <img
              src={Laptop}
              alt="sdsd"
              style={{
                height: "200px",
                objectFit: "contain",
                marginBottom: "-50px",
              }}
            />
          }
          actions={[
            <>
              <DollarOutlined className="text-info" />
              Total: BD {cartTotal}
            </>,
            <>
              <CheckOutlined className="text-info" />
              Total payable: BD {(payable / 100).toFixed()}
            </>,
          ]}
        />
      </div>
      <form onSubmit={handleSubmit} id="payment-form" className="stripe-form">
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
          </span>
        </button>
        {error && (
          <div className="card-error mt-4 text-danger" role="alert">
            {error}
          </div>
        )}
        <p
          className={
            succeeded ? "result-message pt-2" : "result-message hidden"
          }
        >
          Payment Successful{" "}
          <Link to="/user/history">See it in your purchase history</Link>
        </p>
      </form>
    </>
  );
};

export default StripeCheckout;
