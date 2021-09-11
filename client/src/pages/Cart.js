import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { userCart } from "../functions/user";

const Cart = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { cart, user } = useSelector((state) => ({ ...state }));
  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    userCart(cart, user.token)
      .then((res) => {
        console.log("CART POST REQ", res.data);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log(err));
  };

  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>

      {cart.map((p) => (
        <ProductCardInCheckout key={p._id} product={p} />
      ))}
    </table>
  );
  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} products</h4>
          {!cart.length ? (
            <p className="text-center h6 pt-4">
              No products in cart
              <Link to="/shop"> Continue Shopping </Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <p>Products</p>
          {cart.map((c, i) => (
            <div className="" key={i}>
              <p>
                {c.title} x {c.count} = BD {c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>BD {getTotal()}</b>
          <hr />
          {user ? (
            <button
              onClick={saveOrderToDb}
              disabled={!cart.length}
              className="btn btn-sm btn-primary mt-2"
            >
              Proceed to Checkout
            </button>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              <Link
                style={{ color: "white" }}
                to={{
                  pathname: "/login",
                  state: {
                    from: "cart",
                  },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
