import '../../index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { TodosPage } from "./TodosPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TodosPage />
  </React.StrictMode>
);

