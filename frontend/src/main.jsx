import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store";
import Theme from "./utils/theme.jsx";

dayjs.extend(relativeTime);
dayjs.extend(calendar);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Theme>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster toastOptions={{ duration: 5000 }} />
  </Theme>,
);
