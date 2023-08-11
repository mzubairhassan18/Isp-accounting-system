// src/components/Sidebar.tsx

import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UserAddOutlined,
  TeamOutlined,
  BoxPlotOutlined,
  LinkOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { MdOutlineInventory2, MdOutlineBusinessCenter } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import logo from "../assets/logo.png";
import "./sidebar.css";
const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const selectedKey =
    location.pathname === "/about"
      ? "1"
      : location.pathname === "/home"
      ? "2"
      : location.pathname === "/account"
      ? "3"
      : location.pathname === "/user"
      ? "4"
      : location.pathname === "/role"
      ? "5"
      : location.pathname === "/package"
      ? "6"
      : location.pathname === "/connection"
      ? "7"
      : location.pathname === "/inventory"
      ? "8"
      : location.pathname === "/transaction"
      ? "9"
      : location.pathname === "/vendor"
      ? "10"
      : location.pathname === "/employee"
      ? "11"
      : "1"; // Set a default value, in case none of the paths match
  return (
    <Sider
      className="sider"
      theme="dark"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="logo">
        <img
          src={logo}
          alt="Image"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[selectedKey]}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to={"/about"}>About</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link to={"/home"}>Home</Link>
        </Menu.Item>
        <Menu.SubMenu
          key="config"
          icon={<SettingOutlined />}
          title="Configuration"
        >
          <Menu.Item key="3">
            <Link to={"/account"}>Accounts</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to={"/user"}>Users</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to={"/role"}>Roles</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to={"/package"}>Packages</Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to={"/connection"}>Connections</Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link to={"/inventory"}>Inventory</Link>
          </Menu.Item>
          <Menu.Item key="9">
            <Link to={"/transaction"}>Transactions</Link>
          </Menu.Item>
          <Menu.Item key="10">
            <Link to={"/vendor"}>Vendors</Link>
          </Menu.Item>
          <Menu.Item key="11">
            <Link to={"/employee"}>Employees</Link>
          </Menu.Item>
          {/* Add more submenu items as needed */}
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
