import React, { useCallback, useEffect, useState } from "react";
import {
  fetchProductsByFilter,
  getProductsByCount,
} from "../functions/product";
import { useSelector, useDispatch } from "react-redux";
import Productcard from "../components/cards/ProductCard";
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import { getCategories } from "../functions/category";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  CarOutlined,
} from "@ant-design/icons";
import Star from "../components/forms/Star";
import { getSubs } from "../functions/sub";

const { SubMenu } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [subs, setSubs] = useState([]);
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenova",
    "ASUS",
    "HP",
  ]);
  const [shipping, setShipping] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSub, setSelectedSub] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState([0, 0]);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState(null);
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

    // fetch sub categories
    getSubs().then((res) => setSubs(res.data));
  }, []);

  // load Products based on price
  const handleSlider = (value) => {
    setCategoryIds([]);
    // make search state empty in redux state

    setTimeout(() => {
      setOk(!ok);
    }, 300);

    // reset values
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setStar(null);
    setPrice(value);
    setSelectedSub(null);
    setSelectedBrand(null);
    setSelectedColor(null);
    setShipping(null);
  };

  useEffect(() => {
    fetchProducts({ price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);

  // load products based on category

  const handleCategorySelection = (e) => {
    // reset values
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setStar(null);
    setPrice([0, 0]);
    setSelectedSub(null);
    setSelectedBrand(null);
    setSelectedColor(null);
    setShipping(null);

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

  // show star products by star rating
  const handleStarClick = (num) => {
    console.log(num);

    // reset prev values
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(num);
    setSelectedSub(null);
    setSelectedBrand(null);
    setSelectedColor(null);
    setShipping(null);

    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2 ">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  const handleSub = (sub) => {
    console.log("SUB", sub);
    setSelectedSub(sub);

    // reset prev values
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(null);
    setSelectedBrand(null);
    setSelectedColor(null);
    setShipping(null);

    fetchProducts({ sub });
  };

  const showSubs = () =>
    subs.map((s) => (
      <div
        key={s._id}
        onClick={() => handleSub(s._id)}
        className={`p-1 m-1 badge ${
          selectedSub === s._id ? `badge-info` : `badge-secondary `
        }`}
        style={{ cursor: "pointer" }}
      >
        {s.name}
      </div>
    ));

  const handleBrand = (e) => {
    setSelectedBrand(e.target.value);

    // reset prev values
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(null);
    setSelectedColor(null);
    setShipping(null);

    fetchProducts({ brand: e.target.value });
  };

  const showBrands = () =>
    brands.map((b) => (
      <Radio
        name={b}
        className="pb-1 px-1"
        onChange={handleBrand}
        checked={b === selectedBrand ? true : false}
        value={b}
      >
        {b}
      </Radio>
    ));

  const handleColor = (e) => {
    setSelectedColor(e.target.value);

    // reset prev values
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(null);
    setSelectedBrand(null);
    setShipping(null);

    fetchProducts({ color: e.target.value });
  };

  const showColors = () =>
    colors.map((c) => (
      <Radio
        name={c}
        className="pb-1 px-1"
        onChange={handleColor}
        checked={c === selectedColor ? true : false}
        value={c}
      >
        {c}
      </Radio>
    ));

  const handleShippingChange = (e) => {
    // reset prev values
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(null);
    setSelectedBrand(null);

    setShipping(e.target.value);

    fetchProducts({ shipping: e.target.value });
  };

  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingChange}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingChange}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-3">
          <h4 className="text-center">Search/Filter</h4>
          <hr />
          <Menu
            mode="inline"
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
          >
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
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined />
                  <span style={{ verticalAlign: "middle" }}>Rating</span>
                </span>
              }
            >
              <div style={{ marginTop: 10 }}>{showStars()}</div>
            </SubMenu>
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  <span style={{ verticalAlign: "middle" }}>
                    Sub categories
                  </span>
                </span>
              }
            >
              <div className="px-4" style={{ marginTop: 10 }}>
                {showSubs()}
              </div>
            </SubMenu>
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <AppstoreOutlined />
                  <span style={{ verticalAlign: "middle" }}>Brands</span>
                </span>
              }
            >
              <div className="px-4" style={{ marginTop: 10 }}>
                {showBrands()}
              </div>
            </SubMenu>

            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <BgColorsOutlined />
                  <span style={{ verticalAlign: "middle" }}>Colors</span>
                </span>
              }
            >
              <div className="px-4" style={{ marginTop: 10 }}>
                {showColors()}
              </div>
            </SubMenu>
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <CarOutlined />
                  <span style={{ verticalAlign: "middle" }}>Shipping</span>
                </span>
              }
            >
              <div className="px-4" style={{ marginTop: 10 }}>
                {showShipping()}
              </div>
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
