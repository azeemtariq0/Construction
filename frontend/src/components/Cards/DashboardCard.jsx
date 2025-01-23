import clsx from "clsx";
import { ColorRing } from "react-loader-spinner";

const DashboardCard = ({
  icon,
  title,
  description,
  bgColor,
  iconBGColor,
  onClick,
  isLoading = false,
}) => {
  return (
    <div
      className={`${bgColor} flex cursor-pointer items-center gap-4 rounded p-6 transition-all hover:shadow-md`}
      onClick={onClick}
    >
      <div className={`rounded-full ${iconBGColor} p-4`}>{icon}</div>
      <div>
        {isLoading ? (
          <ColorRing
            height="30"
            width="30"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        ) : (
          <h4 className="text-2xl font-semibold">{title}</h4>
        )}
        <p className="text-xs font-semibold">{description}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
