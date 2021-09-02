import React, { useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { createProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";

const initialState = {
  title: "",
  description: "",
  price: "",
  // category: "",
  categories: [],
  // subs: [],
  // shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenova", "ASUS"],
  color: "",
  brand: "",
};

const ProductCreate = () => {
  // redux
  const { user } = useSelector((state) => ({ ...state }));
  const [values, setValues] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        toast.success("Product created");
        window.alert(`${res.data.title} is created`);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.name, "=======", e.target.value);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          <h4>Product create</h4>
          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
