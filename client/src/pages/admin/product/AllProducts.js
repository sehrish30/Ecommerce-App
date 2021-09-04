import React, { useEffect, useState } from "react";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount, removeProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => ({ ...state }));

  const loadAllProducts = () => {
    getProductsByCount(100)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleRemove = (slug) => {
    let answer = window.confirm("Delete?");
    if (answer) {
      removeProduct(slug, user.token)
        .then((res) => {
          loadAllProducts();
          console.log(res.data);
          if (res.data) {
            toast.error("Product is deleted");
          }
        })
        .catch((err) => {
          toast.error(err.response.data);
          console.log(err);
        });
    }
  };

  useEffect(() => {
    loadAllProducts();
    return () => {
      setProducts([]);
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col">
          {loading ? (
            <h4 className="text-danger">loading...</h4>
          ) : (
            <h4>All products</h4>
          )}
          <div className="row">
            {products.map((p) => (
              <div className="col-md-4 pb-3" key={p._id}>
                <AdminProductCard handleRemove={handleRemove} product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
