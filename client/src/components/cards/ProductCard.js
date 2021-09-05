import React from "react";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.jpg";
import { Link } from "react-router-dom";

const { Meta } = Card;
const ProductCard = ({ product }) => {
  const { images, title, description, slug } = product;
  return (
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
        <>
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" />
          </Link>
          View product
        </>,
        <>
          <ShoppingCartOutlined className="text-danger" /> Add to Cart
        </>,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 40)}...`}
      />
    </Card>
  );
};

export default ProductCard;
