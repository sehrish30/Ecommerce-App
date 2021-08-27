import React, { useState } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import firebase from "firebase/app";

import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
const { SubMenu, Item } = Menu;

const Header = () => {
  // state which tells which is active state
  const [current, setCurrent] = useState("home");
  let dispatch = useDispatch();
  let history = useHistory();

  let { user } = useSelector((state) => ({ ...state }));

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
        <Link to="/">Home</Link>
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
              <Link to="/user/history">Dashboard</Link>
            </Item>
          )}
          {user && user.role === "admin" && (
            <Item>
              <Link to="/admin/dashboard">Dashboard</Link>
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
    </Menu>
  );
};

export default Header;
