import { Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../axiosInstance";
import useError from "../../hooks/useError";
import { addToFavorite } from "../../store/features/shopSlice";
import FavoriteButton from "../Button/FavoriteButton";
import { Tooltip } from "antd";

const ShopCard = ({ id, name, image, summary, favorite }) => {
  const dispatch = useDispatch();
  const handleError = useError();

  const { user } = useSelector((state) => state.auth);

  const onAddToFavorite = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        addToFavorite({
          user_id: user.user_id,
          product_id: id,
          is_favorite: favorite ? 0 : 1,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="relative h-[260px] transform cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300">
      {/* Top Section - Product Image */}
      <div className="h-[195px]">
        <img
          src={`${API_URL}/public/${image}`}
          className="size-full"
          alt={name}
        />
      </div>

      {/* Bottom Section - Cart and Info */}
      <div className="absolute bottom-0 z-40 w-full border-t border-gray-200">
        <div className="flex h-1/5 w-full items-center justify-between bg-white p-4">
          <Tooltip title={name}>
            <h1 className="text-xs font-bold text-black">
              {name.length > 42 ? name.slice(0, 42) + "..." : name}
            </h1>
          </Tooltip>
          <FavoriteButton onClick={onAddToFavorite} isSelected={favorite} />
        </div>
      </div>

      {/* Info Section */}
      <div className="group absolute right-[-50px] top-[-50px] h-[88px] w-[88px] overflow-hidden rounded-b-full bg-[#2c2c2c86] backdrop-blur-sm transition-all duration-300 hover:right-0 hover:top-0 hover:h-full hover:w-full hover:rounded-b-none">
        <div className="absolute right-[55px] top-[55px] text-white group-hover:hidden">
          <Info size={18} />
        </div>
        <div className="w-full translate-y-[-200%] scale-50 transform p-4 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
          <h2 className="text-sm font-bold">Summary:</h2>
          <p className="text-xs">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
