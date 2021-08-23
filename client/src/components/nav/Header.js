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
import { useDispatch } from "react-redux";
const { SubMenu, Item } = Menu;

const Header = () => {
  // state which tells which is active state
  const [current, setCurrent] = useState("home");
  let dispatch = useDispatch();
  let history = useHistory();

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

      <SubMenu key="SubMenu" icon={<SettingOutlined />} title="Username">
        <Item key="setting:1">Dashboard</Item>
        <Item icon={<LogoutOutlined />} onClick={logout}>
          Logout
        </Item>
      </SubMenu>
      <Menu.Item
        className="float-right"
        key="register"
        icon={<UserAddOutlined />}
      >
        <Link to="/register">Register</Link>
      </Menu.Item>
      <Item className="float-right" key="login" icon={<UserOutlined />}>
        <Link to="/login">Login</Link>
      </Item>
    </Menu>
  );
};

export default Header;
