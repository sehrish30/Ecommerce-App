import React, { useCallback, useEffect, useState } from "react";
import {
  fetchProductsByFilter,
  getProductsByCount,
} from "../functions/product";
import { useSelector, useDispatch } from "react-redux";
import Productcard from "../components/cards/ProductCard";
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider, Checkbox } from "antd";
import { getCategories } from "../functions/category";
import { DollarOutlined, DownSquareOutlined } from "@ant-design/icons";

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState([0, 0]);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const dispatch = useDispatch();

  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  // load default products on page load
  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      console.log(res.data, "DATA");
      setProducts(res.data);
    });
  };

  // load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  useEffect(() => {
    loadAllProducts();
    // fetch Catgeories
    getCategories().then((res) => setCategories(res.data));
  }, []);

  // load Products based on price
  const handleSlider = (value) => {
    setCategoryIds([]);
    // make search state empty in redux state
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  useEffect(() => {
    fetchProducts({ price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);

  // load products based on category

  const handleCategorySelection = (e) => {
    // dispatch search text clear
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    // remove any price values
    // setCategoryIds((prev) => [...prev, e.target.value]);
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // -1 or index

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    console.log("HAMZA", inTheState);
    fetchProducts({ category: inTheState });
  };

  const showCategories = () =>
    categories.map((c) => (
      <div className="pb-1" key={c._id}>
        <Checkbox
          onChange={handleCategorySelection}
          name="category"
          value={c._id}
          checked={categoryIds.includes(c._id)}
          className="pl-4 pr-4 pb-2"
        >
          {c.name}
        </Checkbox>
      </div>
    ));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-3">
          <h4 className="text-center">Search/Filter</h4>
          <hr />
          <Menu mode="inline" defaultOpenKeys={["1", "2"]}>
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined />
                  <span style={{ verticalAlign: "middle" }}>Price</span>
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `BD ${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="5000"
                />
              </div>
            </SubMenu>
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  <span style={{ verticalAlign: "middle" }}>Categories</span>
                </span>
              }
            >
              <div style={{ marginTop: 10 }}>{showCategories()}</div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}
          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
