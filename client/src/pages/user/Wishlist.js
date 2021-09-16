import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getWishList, removeWishlist } from "../../functions/user";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
const Wishlist = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [wishlist, setWishlist] = useState([]);

  const loadWishList = () =>
    getWishList(user.token).then((res) => {
      console.log("WISHLIST", res.data);
      setWishlist(res.data.wishlist);
    });

  const handleRemove = (productId) =>
    removeWishlist(productId, user.token).then((res) => {
      loadWishList();
    });

  useEffect(() => {
    loadWishList();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>
          {wishlist.length > 0 ? (
            wishlist.map((p) => (
              <div key={p._id} className="alert alert-secondary">
                <Link to={`/product/${p.slug}`}>{p.title}</Link>
                <span
                  onClick={() => handleRemove(p._id)}
                  className="btn btn-sm float-right"
                >
                  <DeleteOutlined
                    style={{ verticalAlign: "middle" }}
                    className="text-danger"
                  />
                </span>
              </div>
            ))
          ) : (
            <h4 className="text-center mt-4">No products found</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
