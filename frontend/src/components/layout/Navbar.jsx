import { Badge, Button } from "antd";
import {
  CircleChevronLeft,
  CircleChevronRight,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleSidebar } from "../../store/features/sidebarSlice";
import NotificationMenu from "../Menu/NotificationMenu";
import ProfileMenu from "../Menu/ProfileMenu";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isCollapsed } = useSelector((state) => state.sidebar);
  const { user } = useSelector((state) => state.auth);
  const { cartTotal } = useSelector((state) => state.notifications);

  return (
    <div className="bg-red-1 !sticky top-0 z-40 flex min-h-14 items-center justify-between gap-4 border-b p-1 px-8">
      <Button
        type="text"
        onClick={() => dispatch(toggleSidebar())}
        icon={
          isCollapsed ? (
            <CircleChevronRight color="white" size={24} />
          ) : (
            <CircleChevronLeft color="white" size={24} />
          )
        }
      />

      <div className="flex items-center gap-4">
        <NotificationMenu />

        {user?.user_type === "Partner" && (
          <Link to="/cart">
            <Badge count={cartTotal} color="#808080" offset={[-6, 4]}>
              <Button
                type="text"
                icon={<ShoppingCart className="text-white" size={28} />}
              />
            </Badge>
          </Link>
        )}
        <ProfileMenu />
      </div>
    </div>
  );
};
export default Navbar;
