// src/components/Header.tsx

import React from 'react';
import { Button, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header } = Layout;
interface HeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}
const AppHeader: React.FC<HeaderProps> = ({ collapsed, toggleCollapse }: HeaderProps) => {
  return (
    <Header className="site-layout-background" 
      style={{ padding: 0, background: "white", position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center', }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => toggleCollapse()}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
          color: "black"
        }}
      />
    </Header>
  );
};

export default AppHeader;
