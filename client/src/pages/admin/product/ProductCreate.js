import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { createProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { LoadingOutlined } from "@ant-design/icons";

import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";

const initialState = {
  title: "",
  description: "",
  price: "",
  // category: "",
  categories: [],
  subs: [],
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
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadCategories = () =>
    getCategories().then((c) => setValues({ ...values, categories: c.data }));

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        toast.success("Product created");
        window.alert(`${res.data.title} is created`);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response?.data?.err);
      });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.name, "=======", e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value);
    setValues({ ...values, subs: [], category: e.target.value });
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res?.data);
    });
    setShowSub(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1 my-2" />
          ) : (
            <h4>Product create</h4>
          )}

          <div className="p-3">
            <FileUpload
              setLoading={setLoading}
              loading={loading}
              values={values}
              setValues={setValues}
            />
          </div>
          {JSON.stringify(values.images)}
          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            setValues={setValues}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
