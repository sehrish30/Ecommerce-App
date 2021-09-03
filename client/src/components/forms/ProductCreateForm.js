import React from "react";

import { Select } from "antd";
const { Option } = Select;

const ProductCreateForm = ({
  values,
  handleCategoryChange,
  handleSubmit,
  handleChange,
  subOptions,
  setValues,
  showSub,
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
    categories,
  } = values;
  return (
    <div>
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
          <select name="color" className="form-control" onChange={handleChange}>
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
          <select name="brand" className="form-control" onChange={handleChange}>
            <option>Please select</option>
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
          >
            <option>Please select</option>
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {showSub && (
          <div className="my-4">
            <label>Sub Categories</label>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              value={subs}
              onChange={(value) => setValues({ ...values, subs: value })}
            >
              {subOptions.map((s) => (
                <Option key={s._id} value={s._id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </div>
        )}
        <button className="btn btn-outline-info">Save</button>
      </form>
    </div>
  );
};

export default ProductCreateForm;
