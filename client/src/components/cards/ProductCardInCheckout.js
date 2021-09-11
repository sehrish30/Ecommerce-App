import React from "react";
import ModalImage from "react-modal-image";
import Laptop from "../../images/laptop.jpg";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ product }) => {
  const dispatch = useDispatch();
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];

  const handleQuantityChange = (e) => {
    let count = e.target.value < 1 ? 1 : parseInt(e.target.value);
    if (count > product.quantity) {
      toast.error(`Max available quantity: ${product.quantity}`);
      return;
    }

    let cart = [];
    if (typeof window) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.forEach((cp, i) => {
        if (cp._id === product._id) {
          cart[i].count = count;
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleColorChange = (e) => {
    let cart = [];
    if (typeof window) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // loop cart and change the attribute color of the cart
      cart.forEach((cp, i) => {
        if (cp._id === product._id) {
          cart[i].color = e.target.value;
        }
      });

      console.log("CART UPDATE COLOr", cart);

      // change local Storage
      localStorage.setItem("cart", JSON.stringify(cart));
      // change the redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    let cart = [];
    if (typeof window) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // loop cart and change the attribute color of the cart
      cart.forEach((cp, i) => {
        if (cp._id === product._id) {
          cart.splice(i, 1);
        }
      });

      console.log("CART UPDATE COLOr", cart);

      // change local Storage
      localStorage.setItem("cart", JSON.stringify(cart));
      // change the redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            {product.images.length ? (
              <ModalImage
                small={product.images[0].url}
                large={product.images[0].url}
                alt="Product in cart"
              />
            ) : (
              <ModalImage
                small={Laptop}
                large={Laptop}
                alt="No display of product in cart"
              />
            )}
          </div>
        </td>
        <td>{product.title}</td>
        <td>BD {product.price}</td>
        <td>{product.brand}</td>
        <td>
          <select
            onChange={handleColorChange}
            name="color"
            className="form-control"
            id=""
          >
            {product.color ? (
              <option value={product.color}>{product.color}</option>
            ) : (
              <option>Select</option>
            )}
            {colors
              .filter((c) => product.color !== c)
              .map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </select>
        </td>
        <td className="text-center">
          <input
            onChange={handleQuantityChange}
            value={product.count}
            type="number"
            className="form-control"
          />
        </td>
        <td className="text-center">
          {product.shipping ? (
            <CheckCircleOutlined
              style={{ fontSize: "20px" }}
              className="text-success"
            />
          ) : (
            <CloseCircleOutlined
              style={{ fontSize: "20px" }}
              className="text-danger"
            />
          )}
        </td>
        <td className="text-center">
          <CloseOutlined
            className="text-danger pointer"
            onClick={handleRemove}
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
