import React from "react";

import { Select } from "antd";
const { Option } = Select;

const ProductUpdateForm = ({
  values,
  handleCategoryChange,
  handleSubmit,
  handleChange,
  subOptions,
  setValues,
  showSub,
  categories,
  arrayOfSubsIds,
  setArrayOfSubIds,
  selectedCategory,
}) => {
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
  } = values;
  return (
    <div>
      {JSON.stringify(values)}
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
            value={shipping === "Yes" ? "Yes" : "No"}
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
            value={color}
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
            value={brand}
            name="brand"
            className="form-control"
            onChange={handleChange}
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            className="form-control"
            onChange={handleCategoryChange}
            value={selectedCategory ? selectedCategory : category._id}
          >
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        <div className="my-4">
          <label>Sub Categories</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            value={arrayOfSubsIds}
            onChange={(value) => setArrayOfSubIds(value)}
          >
            {subOptions.map((s) => (
              <Option key={s._id} value={s._id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </div>

        <button className="btn btn-outline-info">Save</button>
      </form>
    </div>
  );
};

export default ProductUpdateForm;
