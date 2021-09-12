import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  const loadAllCoupons = () => {
    getCoupons().then((res) => setCoupons(res.data));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        loadAllCoupons();
        setLoading(false);
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`${res.data.name} is created`);
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Coupon wasnot created`);
      });
  };

  const handleRemove = (id) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeCoupon(id, user.token)
        .then((response) => {
          loadAllCoupons();
          setLoading(false);
          toast.error(`${response.data.name} deleted`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    loadAllCoupons();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Coupon</h4>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                value={name}
                autoFocus
                required
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                value={discount}
                required
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <DatePicker
                onChange={(date) => setExpiry(date)}
                className="form-control"
                selected={new Date()}
                required
              />
            </div>

            <button className="btn btn-outline-primary">Save</button>
          </form>
          <div className="mt-4">
            <h4>{coupons.length} Coupons</h4>

            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Expiry</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{new Date(c.expiry).toLocaleDateString()}</td>
                    <td>{c.discount}%</td>
                    <td
                      onClick={() => handleRemove(c._id)}
                      className="text-center text-danger pointer"
                    >
                      <DeleteOutlined />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
