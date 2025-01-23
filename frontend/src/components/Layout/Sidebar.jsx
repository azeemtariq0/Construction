import { Avatar, Layout, Menu } from 'antd';
import { useEffect } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { BsTags } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';
import { TfiMoney } from 'react-icons/tfi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/features/sidebarSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isCollapsed } = useSelector((state) => state.sidebar);

  const activeKey = pathname === '/' ? '/' : pathname.split('/')[1];
  let isSmallScreen = window.innerWidth <= 1000;

  const items = [
    {
      key: '/',
      icon: <MdOutlineDashboard size={18} />,
      label: <Link to="/">Dashboard</Link>
    },
    {
      key: 'expense-type',
      icon: <BsTags size={18} />,
      label: <Link to="/expense-type">Expense Type</Link>
    },
    {
      key: 'expense',
      icon: <TfiMoney size={18} />,
      label: <Link to="/expense">Expense</Link>
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 1000;
      dispatch(toggleSidebar(isSmallScreen));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Layout.Sider
      collapsedWidth="0"
      theme="light"
      collapsed={isCollapsed}
      className={`${isSmallScreen ? '!fixed' : '!sticky'} ${
        isCollapsed ? '' : 'border-r'
      } scrollbar !left-0 !top-0 z-50 h-screen overflow-y-auto`}
      width={240}>
      <div className="m-2 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-200 p-4 px-2">
        {isSmallScreen && (
          <div
            className="absolute right-5 top-5 cursor-pointer rounded border bg-white p-1 hover:bg-gray-50"
            onClick={() => dispatch(toggleSidebar())}>
            <BiChevronLeft size={18} />
          </div>
        )}
        <div>
          <Avatar size={56} src={null} icon={<FaRegUser />} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">Muhammad Azeem</p>
          <p className="text-xs">azeem@gmail.com</p>
        </div>
      </div>

      <Menu
        className="!border-none"
        selectedKeys={[activeKey]}
        onClick={() => {
          isSmallScreen && dispatch(toggleSidebar());
        }}
        mode="inline"
        items={items}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
