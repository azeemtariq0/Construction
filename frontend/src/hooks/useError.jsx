import { WifiOff } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const useError = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = (error, showMessage = true) => {
    console.log(error);
    // if:  if user unauthorize then logout and redirect to login page
    // else if: if network error then show error message
    // else: show error message
    if (error?.response?.status === 401) {
      showMessage &&
        toast.error(error?.response?.data?.error || "You need to login again");
      localStorage.clear();
      navigate("/login", {
        state: { prevUrl: `${location.pathname}${location.search}` },
      });
    } else if (error?.message === "Network Error") {
      showMessage &&
        toast.error("Please check your internet connection.", {
          icon: <WifiOff size={20} color="red" />,
        });
    } else {
      showMessage &&
        toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  return handleError;
};

export default useError;
