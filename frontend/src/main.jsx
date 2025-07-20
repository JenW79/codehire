// frontend/src/main.jsx
import { restoreCSRF, csrfFetch } from "./store/csrf";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import configureStore from "../src/store/store";
import * as sessionActions from "./store/session";
import { ModalProvider } from "./context/Modal";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider>
        <div id="app-wrapper">
          <App />
        </div>
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);
