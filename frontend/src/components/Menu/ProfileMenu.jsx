import { Avatar, Dropdown } from "antd";
import { ChevronDown, LockKeyhole, LogOut, User2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UpdatePasswordModal from "../Modals/UpdatePasswordModal";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-2" onClick={handleLogout}>
      <LogOut size={16} />
      <span>Logout</span>
    </div>
  );
};

const ChangePassword = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-2"
        onClick={() => setModalIsOpen(true)}
      >
        <LockKeyhole size={16} />
        <span>Update Password</span>
      </div>
      <UpdatePasswordModal
        open={modalIsOpen}
        closable={true}
        onClose={() => setModalIsOpen(false)}
      />
    </>
  );
};

const ProfileMenu = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "1",
            label: <ChangePassword />,
          },
          {
            key: "2",
            danger: true,
            label: <Logout />,
          },
        ],
      }}
    >
      <div className="flex cursor-pointer items-center gap-2 rounded-lg p-1 px-4">
        <Avatar src={user?.image_url} icon={<User2 />} size={40} />
        <div>
          <span className="text-white">{user.name}</span>
          <div className="flex items-center gap-2 text-white">
            <p className="text-xs text-white">{user.user_type}</p>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </Dropdown>
  );
};

export default ProfileMenu;
