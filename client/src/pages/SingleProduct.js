import React, { useState } from "react";
import { Card, Tabs } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Laptop from "../images/laptop.jpg";
import ProductListItems from "../components/cards/ProductListItems";
import StarRatings from "react-star-ratings";
import RatingModal from "./modal/RatingModal";
import { showAverage } from "../functions/rating";

const { TabPane } = Tabs;

// this is children component of product page
const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product;
  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images?.map((i) => (
              <img alt="Laptop" src={i.url} key={i.public_id} />
            ))}
          </Carousel>
        ) : (
          <Card
            hoverable
            className="m-4"
            cover={
              <img className="mb-3 card-image" alt="product" src={Laptop} />
            }
          />
        )}
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call us on +973 00089209029 to learn more about the product
          </TabPane>
        </Tabs>
      </div>
      <div className="col-md-5">
        <h1 className="bg-info p-3" style={{ color: "white", borderRadius: 3 }}>
          {title}
        </h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No ratings yet</div>
        )}

        <Card
          actions={[
            <>
              <ShoppingCartOutlined className="text-success" /> <br />
              Add to Cart
            </>,
            <Link to="/">
              <HeartOutlined className="text-info" />
              <br />
              Add to Wishlist
            </Link>,
            <div>
              <RatingModal>
                <StarRatings
                  // changeRating={(newRating, name) =>
                  //   console.log("newRating", newRating, "name", name)
                  // }
                  changeRating={onStarClick}
                  rating={star}
                  name={_id}
                  numberOfStars={5}
                  isSelectable={true}
                  starRatedColor="gold"
                  starHoverColor="gold"
                />
              </RatingModal>
            </div>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
