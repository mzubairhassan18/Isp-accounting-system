// src/components/Footer.tsx

import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      {/* Add footer content here */}
      Ant Design ©{new Date().getFullYear()} Created by You
    </Footer>
  );
};

export default AppFooter;
