import React, { useEffect, useState } from "react";
import { getUserCart, emptyUserCart, saveUserAddress } from "../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
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

  const handleAddress = (e) => {
    // let add = e.target.value.replace("<p><br></p>", "");
    // setAddress(add);
    // console.log(add)
  };

  return (
    <div className="row px-4 pt-4">
      <div className="col-md-6">
        <h4>Delivery address</h4>
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <div className="text-right">
          <button className="btn btn-primary mt-2 " onClick={saveAddressToDb}>
            Save
          </button>
        </div>
        <hr />
        <h4>Got Coupon?</h4>
        Coupon input and apply btn
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>

        <hr />
        <p>Products {products.length}</p>
        <hr />
        {products.map((p, i) => (
          <div key={i}>
            <p>
              {p.product.title} ({p.color}) * {p.count} = BD{" "}
              {p.product.price * p.count}
            </p>
          </div>
        ))}
        <hr />
        <p
          style={{
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "Kaisei Tokumin",
          }}
        >
          Total: BD {total}
        </p>

        <div className="row">
          <div className="col-md-6">
            <button
              disabled={!addressSaved || !products.length}
              className="btn btn-primary"
            >
              Place Order
            </button>
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
