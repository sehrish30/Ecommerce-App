import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Laptop from "../../images/laptop.jpg";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const imageStyle = { width: "100%", height: "100px", objectFit: "cover" };
  const { drawer, cart } = useSelector((state) => ({ ...state }));
  return (
    <Drawer
      title={`Cart / ${cart.length} products`}
      placement="right"
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
      visible={drawer}
    >
      {cart.map((cp) => (
        <div key={cp._id} className="row">
          <div className="col">
            {cp.images[0] ? (
              <>
                <img
                  alt="Cart product"
                  src={cp.images[0].url}
                  style={imageStyle}
                />
                <p className="text-center bg-info text-light">
                  {cp.title} x {cp.count}
                </p>
              </>
            ) : (
              <>
                <img alt="Cart product less" src={Laptop} style={imageStyle} />
                <p className="text-center bg-info text-light">
                  {cp.title} x {cp.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <Link className="text-center " to="/cart">
        <button
          onClick={() => {
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            });
          }}
          className="text-center btn btn-primary btn-raised btn-block"
        >
          Go to Cart
        </button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
