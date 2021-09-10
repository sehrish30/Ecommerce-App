import React, { useState } from "react";
import { Menu, Badge } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import firebase from "firebase/app";

import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "../forms/Search";

const { SubMenu, Item } = Menu;

const Header = () => {
  // state which tells which is active state
  const [current, setCurrent] = useState("home");
  let dispatch = useDispatch();
  let history = useHistory();

  let { user, cart } = useSelector((state) => ({ ...state }));

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };
  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="home" icon={<HomeOutlined />}>
        <Link style={{ verticalAlign: "middle" }} to="/">
          Home
        </Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link style={{ verticalAlign: "middle" }} to="/shop">
          Shop
        </Link>
      </Item>
      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link style={{ verticalAlign: "middle" }} to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {user && (
        <SubMenu
          className="float-right"
          key="SubMenu"
          icon={<SettingOutlined />}
          title={user.email && user.email.split("@")[0]}
        >
          {user && user.role === "subscriber" && (
            <Item>
              <Link style={{ verticalAlign: "middle" }} to="/user/history">
                Dashboard
              </Link>
            </Item>
          )}
          {user && user.role === "admin" && (
            <Item>
              <Link style={{ verticalAlign: "middle" }} to="/admin/dashboard">
                Dashboard
              </Link>
            </Item>
          )}
          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}
      {!user && (
        <Menu.Item
          className="float-right"
          key="register"
          icon={<UserAddOutlined />}
        >
          <Link to="/register">Register</Link>
        </Menu.Item>
      )}
      {!user && (
        <Item className="float-right" key="login" icon={<UserOutlined />}>
          <Link to="/login">Login</Link>
        </Item>
      )}
      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
