import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.jpg";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";

const { Meta } = Card;
const ProductCard = ({ product }) => {
  const { images, title, description, slug, price } = product;
  const [tooltip, setTooltip] = useState("Click to add");
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state) => ({ ...state }));

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in localstorage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      console.log(unique, "LOCAL STORAGE");
      localStorage.setItem("cart", JSON.stringify(unique));
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });

      // show tooltip
      setTooltip("Added to cart");
    }
  };
  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">No ratings yet</div>
      )}
      <Card
        hoverable
        className="m-4"
        cover={
          <img
            style={{ height: "200px", objectFit: "contain" }}
            alt="product"
            src={images.length > 0 ? images[0]?.url : laptop}
          />
        }
        actions={[
          <Link to={`/product/${slug}`} style={{ flexDirection: "column" }}>
            <EyeOutlined className="text-warning" />

            <p>View product</p>
          </Link>,
          <Tooltip title={tooltip}>
            <div onClick={handleAddToCart} style={{ flexDirection: "column" }}>
              <ShoppingCartOutlined className="text-danger" />
              <p>Add to Cart</p>
            </div>
          </Tooltip>,
        ]}
      >
        <Meta
          title={title}
          description={`${description && description.substring(0, 40)}...`}
        />
        <h6 className="text-warning pt-2">BD {price}</h6>
      </Card>
    </>
  );
};

export default ProductCard;
