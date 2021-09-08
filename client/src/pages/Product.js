import React, { useEffect, useState } from "react";
import { getProduct, productStar } from "../functions/product";
import SingleProduct from "./SingleProduct";
import { useSelector } from "react-redux";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const { slug } = match.params;

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star); // current user's star
    }
  });

  const onStarClick = (newRating, name) => {
    console.table(newRating, name);
    setStar(newRating);
    productStar(name, newRating, user.token).then((res) => {
      console.log("RES DATA", res);
      // show updated rating in real time
      loadSingleProduct();
    });
  };

  const loadSingleProduct = () =>
    getProduct(slug).then((res) => setProduct(res.data));
  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          star={star}
          product={product}
          onStarClick={onStarClick}
        />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related products</h4>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Product;
