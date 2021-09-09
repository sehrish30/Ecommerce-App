import React, { useState, useEffect } from "react";
import { getSub } from "../../functions/sub";
import { Link } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";

const SubHome = ({ match }) => {
  const [sub, setSub] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getSub(slug).then((res) => {
      console.log(res.data);
      console.log(JSON.stringify(res.data, null, 4));
      setSub(res.data.sub);
      setProducts(res.data.products);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {loading ? (
            <h6 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              Loading...
            </h6>
          ) : (
            <h6 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              {products.length} Product(s) in "{sub.name}" Sub category
            </h6>
          )}
        </div>
      </div>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-4" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubHome;
