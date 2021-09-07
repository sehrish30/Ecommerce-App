import { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../functions/product";

import LoadingCard from "../cards/LoadingCard";
import ProductCard from "../cards/ProductCard";
import { Pagination } from "antd";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  const loadAllProduct = () => {
    setLoading(true);
    // sort, order, limit
    getProducts("sold", "desc", page)
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  useEffect(() => {
    loadAllProduct();
  }, [page]);

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
          <Pagination
            onChange={(value) => setPage(value)}
            current={page}
            total={(productsCount / 3) * 10}
          />
        </nav>
      </div>
    </>
  );
};

export default BestSellers;
