import React, { useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { createProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  categories: [],
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenova", "ASUS"],
  color: "",
  brand: "",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const {
    title,
    description,
    price,
    category,
    subs,
    images,
    shipping,
    quantity,
    colors,
    brands,
    color,
    brand,
    categories,
  } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (value) => {};

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          <h4>Product create</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={title}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={description}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={price}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Shipping</label>
              <select
                onChange={handleChange}
                name="shipping"
                className="form-control"
              >
                <option>Please select</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={quantity}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <select
                name="color"
                className="form-control"
                onChange={handleChange}
              >
                <option>Please select</option>
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <select
                name="brand"
                className="form-control"
                onChange={handleChange}
              >
                <option>Please select</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-outline-info">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
