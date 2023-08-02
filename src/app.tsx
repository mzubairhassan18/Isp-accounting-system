import React, { useState } from 'react';
import { ConfigProvider, Spin } from 'antd'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout, theme } from 'antd';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import AccountListPage from './screens/Account';

import "./styles/app.css"
import UserListPage from './screens/User';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { customTheme } from './styles/theme';
import RolePage from './screens/Role';
import UserPage from './screens/User';
import AccountPage from './screens/Account';
import PackagePage from './screens/Package';
import ConnectionPage from './screens/Connection';

import { CSSTransition, TransitionGroup } from 'react-transition-group';


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { Content } = Layout;
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
      <ConfigProvider
    theme={customTheme}
  >
      <Layout hasSider={true} style={{ maxHeight: '100vh' }} >
        <Sidebar collapsed={collapsed} />
        <Layout className={collapsed ? 'collapsed-layout' : 'expanded-layout'} >
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header collapsed={collapsed} toggleCollapse={toggleCollapse} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial', transition: '1s ease', flexGrow: 1 }}>
          <div className="content-overlay">
            <TransitionGroup>
              <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
                <Routes location={location}>
                  <Route path="/home" element={<HomeScreen />} />
                  <Route path="/about" element={<AboutScreen />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/user" element={<UserPage />} />
                  <Route path="/role" element={<RolePage />} />
                  <Route path="/package" element={<PackagePage />} />
                  <Route path="/connection" element={<ConnectionPage />} />
                  {/* Add more routes for other screens */}
                </Routes>
              </CSSTransition>
            </TransitionGroup>
          </div>
          </Content>
          <Footer />
          </ div>
        </Layout>
      </Layout>
      </ConfigProvider>
  );
};

export default App;