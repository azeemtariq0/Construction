import { Button, Tooltip } from "antd";
import { Heart } from "lucide-react";

const FavoriteButton = ({ onClick, isSelected, tooltip, size = "middle" }) => {
  return (
    <Tooltip
      title={
        tooltip
          ? tooltip
          : isSelected
            ? "Remove from favorites"
            : "Add to favorites"
      }
    >
      <Button
        onClick={onClick}
        className="min-w-8"
        size={size}
        icon={
          <Heart
            size={size === "middle" ? 18 : 22}
            fill={isSelected ? "#ce0105" : "#fff"}
            stroke={isSelected ? "#ce0105" : "#000"}
          />
        }
      />
    </Tooltip>
  );
};

export default FavoriteButton;
