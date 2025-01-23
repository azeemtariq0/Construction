import { Avatar, Dropdown } from 'antd';
import { FaRegUser } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex items-center gap-2" onClick={handleLogout}>
      <MdLogout size={16} />
      <span>Logout</span>
    </div>
  );
};

const ProfileMenu = () => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: '1',
            danger: true,
            label: <Logout />
          }
        ]
      }}
      arrow>
      <Avatar src={null} icon={<FaRegUser />} size={40} />
    </Dropdown>
  );
};

export default ProfileMenu;
