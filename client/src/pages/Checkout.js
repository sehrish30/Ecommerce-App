import React, { useEffect, useState } from "react";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = ({ history }) => {
  const { user, COD } = useSelector((state) => ({ ...state }));
  const couponExists = useSelector((state) => state.coupon);

  const [products, setProducts] = useState([]);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const dispatch = useDispatch();

  const emptyCart = () => {
    // remove from lcoalStorage
    if (typeof window) {
      localStorage.removeItem("cart");
    }
    // remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    // remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount("");
      setCoupon("");
      toast.success("Cart is empty. Continue shopping");
    });
  };
  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    });
  };

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <div className="text-right">
        <button className="btn btn-primary mt-2 " onClick={saveAddressToDb}>
          Save
        </button>
      </div>
    </>
  );

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) * {p.count} = BD{" "}
          {p.product.price * p.count}
        </p>
      </div>
    ));

  const applyDiscountCoupon = () => {
    console.log("sEnd coupon", coupon);
    applyCoupon(user.token, coupon)
      .then((res) => {
        console.log("COUPOM", res.data);
        if (res.data) {
          setTotalAfterDiscount(res.data);

          // push the total after discount to redux
          dispatch({
            type: "COUPON_APPLIED",
            payload: true,
          });
        }
        if (res.status >= 400 && res.status < 500) {
          setDiscountError(res.data.err);
          // update redux state
        }
      })
      .catch((err) => {
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
        setDiscountError("Code invalid");
      });
  };
  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponExists).then((res) => {
      console.log("USER CASH", res.data);
      // empty cart from redux, local Storage reset coupon
      // redirect user to user history
      if (res.data.ok) {
        // empty local storage
        if (typeof window) {
          localStorage.removeItem("cart");
        }

        // empty redux cart
        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });

        // empty redux coupon
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });

        // empty redux COD
        dispatch({
          type: "COD",
          payload: false,
        });

        // empty cart from database
        emptyUserCart(user.token);

        // redirect
        setTimeout(() => {
          history.push("/user/history");
        }, 1000);
      }
    });
  };

  const showApplyCoupon = () => (
    <>
      <input
        value={coupon}
        onChange={(e) => {
          setDiscountError("");
          setCoupon(e.target.value);
        }}
        type="text"
        className="form-control"
      />
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  );

  return (
    <div className="row px-4 pt-4">
      <div className="col-md-6">
        <h4>Delivery address</h4>
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        {showApplyCoupon()}
        {discountError && (
          <p className="bg-danger p-2 mt-2" style={{ color: "white" }}>
            {discountError}
          </p>
        )}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>

        <hr />
        <p>Products {products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p
          style={{
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "Kaisei Tokumin",
          }}
        >
          Total: BD {total}
          {totalAfterDiscount && (
            <p className="bg-success p-2 mt-2" style={{ color: "white" }}>
              Discount price: BD {totalAfterDiscount}
            </p>
          )}
        </p>

        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                onClick={createCashOrder}
                disabled={!addressSaved || !products.length}
                className="btn btn-primary"
              >
                Place Order
              </button>
            ) : (
              <button
                onClick={() => history.push("payment")}
                disabled={!addressSaved || !products.length}
                className="btn btn-primary"
              >
                Place Order
              </button>
            )}
          </div>
          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-secondary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
