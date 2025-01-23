/* eslint-disable react/jsx-no-undef */
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';

const MainLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Navbar />
        <Content className="bg-[#f2f2f2] p-4">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
export default MainLayout;
