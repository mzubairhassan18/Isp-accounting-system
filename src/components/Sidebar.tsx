// src/components/Sidebar.tsx

import React from 'react';
import { Layout, Menu, Image } from 'antd';
import { Link } from 'react-router-dom';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UserAddOutlined,
  TeamOutlined,
  BoxPlotOutlined,LinkOutlined 
} from '@ant-design/icons';
import logo from "../assets/logo.png";
import "./sidebar.css"
const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  return (
    <Sider theme="dark" trigger={null} collapsible collapsed={collapsed} style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
    }}>
      <div className="logo" >
        <img src={logo} alt='Image' style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
      <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <Link to={"/about"}><UserOutlined /></Link>,
              label: 'About',
            },
            {
              key: '2',
              icon: <Link to={"/home"}><VideoCameraOutlined /></Link>,
              label: 'Home',
            },
            {
              key: '3',
              icon: <Link to={"/account"}><UploadOutlined /></Link>,
              label: 'Accounts',
            },
            {
              key: '4',
              icon: <Link to={"/user"}><UserAddOutlined /></Link>,
              label: 'Users',
            },
            {
              key: '5',
              icon: <Link to={"/role"}><TeamOutlined  /></Link>,
              label: 'Roles',
            
            },
            {
              key: '6',
              icon: <Link to={"/package"}><BoxPlotOutlined   /></Link>,
              label: 'Packages',
            }
            ,
            {
              key: '7',
              icon: <Link to={"/connection"}><LinkOutlined /></Link>,
              label: 'Connections',
            }
          ]}
        />
    </Sider>
  );
};

export default Sidebar;
