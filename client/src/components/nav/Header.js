import React, { useState } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";
const { SubMenu, Item } = Menu;

const Header = () => {
  // state which tells which is active state
  const [current, setCurrent] = useState("home");

  const handleClick = (e) => {
    setCurrent(e.key);
  };
  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Item>

      <SubMenu key="SubMenu" icon={<SettingOutlined />} title="Username">
        <Item key="setting:1">Dashboard</Item>
        <Item key="setting:2">Logout</Item>
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
