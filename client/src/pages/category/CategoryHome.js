import React, { useState, useEffect } from "react";
import { getCategory } from "../../functions/category";
import { Link } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";

const CategoryHome = ({ match }) => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getCategory(slug).then((res) => {
      console.log(res.data);
      console.log(JSON.stringify(category, null, 4));
      setCategory(res.data);
    });
  }, []);

  return <div>{JSON.stringify(category, null, 4)}</div>;
};

export default CategoryHome;
