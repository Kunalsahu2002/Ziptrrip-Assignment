import '../../index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { TodoPage } from "./TodoPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TodoPage />
  </React.StrictMode>
);

