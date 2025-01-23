import { ConfigProvider } from "antd";

const theme = {
  token: {
    colorPrimary: "#ce0105",
    fontFamily: "Montserrat, sans-serif",
    colorInfo: "#eee",
  },
  components: {
    Menu: {
      itemSelectedColor: "#0c71c3",
      itemBorderRadius: 2,
      itemHeight: 35,
      itemColor: "#4b4c4c",
    },
    Breadcrumb: {
      itemColor: "#ce0105",
      colorBgTextHover: "rgba(255, 255, 255, 0)",
      lastItemColor: "#000",
      separatorColor: "rgb(0, 0, 0)",
      fontSize: 16,
    },
    Button: {
      borderRadius: 4,
      borderRadiusLG: 4,
      borderRadiusSM: 4,
    },
    Pagination: {
      borderRadius: 31,
      itemActiveBg: "#ce0105",
      colorPrimary: "rgb(250, 250, 250)",
      colorPrimaryHover: "rgb(255, 255, 255)",
    },
    Table: {
      headerBorderRadius: 2,
    },
    Tooltip: {
      fontSize: 12,
      controlHeight: 28,
      lineHeight: 1,
    },
  },
};

const Theme = ({ children }) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
export default Theme;
