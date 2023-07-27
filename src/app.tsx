import React, { useState } from 'react';
import { ConfigProvider } from 'antd'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Layout, theme } from 'antd';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import AccountListPage from './screens/AccountPage';



const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { Content } = Layout;
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Router>
      <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#42210b',

      }
    }}
  >
      <Layout hasSider={true} style={{ minHeight: '100vh' }} >
        <Sidebar collapsed={collapsed} />
        <Layout className={collapsed ? 'collapsed-layout' : 'expanded-layout'}>
          <Header collapsed={collapsed} toggleCollapse={toggleCollapse} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Routes>
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/account" element={<AccountListPage />} />
              {/* Add more routes for other screens */}
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
      </ConfigProvider>
    </Router>
  );
};

export default App;