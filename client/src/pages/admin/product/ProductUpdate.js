import React, { useState, useEffect, useCallback } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { LoadingOutlined } from "@ant-design/icons";
import { getProduct, updateProduct } from "../../../functions/product";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const initialState = {
    title: "",
    description: "",
    price: "",
    category: "",

    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenova", "ASUS"],
    color: "",
    brand: "",
  };
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [subOptions, setSubOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [arrayOfSubsIds, setArrayOfSubIds] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { slug } = match.params;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    values.subs = arrayOfSubsIds;
    values.category = selectedCategory ? selectedCategory : values.category;
    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.title} is updated`);
        history.push("/admin/products");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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

  const loadProduct = useCallback(() => {
    getProduct(slug)
      .then((p) => {
        setLoading(false);
        console.log("Single Product", p.data);

        // 1 load single product
        setValues({ ...values, ...p.data });
        // 2 load single product category subs
        getCategorySubs(p.data.category._id).then((res) => {
          // first load, show def
          setSubOptions(res.data);
        });
        // 3 prepare array of sub Ids to show as default sub values in antd Select
        let arr = [];
        p.data.subs.map((s) => {
          arr.push(s._id);
        });
        // required for antd design select to work
        setArrayOfSubIds((prev) => arr);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [slug]);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, [loadProduct]);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value, values.category._id);
    setValues({ ...values, subs: [] });
    setSelectedCategory(e.target.value);
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res?.data);
    });
    // if user clicks back to original category
    // show its sub categories by default
    if (values.category._id === e.target.value) {
      console.log("MATCH");
      loadProduct();
    }
    // clear old category sub categories
    setArrayOfSubIds([]);
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
            <h4>Product Update</h4>
          )}
          <div className="p-3">
            <FileUpload
              setLoading={setLoading}
              loading={loading}
              values={values}
              setValues={setValues}
            />
          </div>
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            setValues={setValues}
            showSub={showSub}
            categories={categories}
            arrayOfSubsIds={arrayOfSubsIds}
            setArrayOfSubIds={setArrayOfSubIds}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
