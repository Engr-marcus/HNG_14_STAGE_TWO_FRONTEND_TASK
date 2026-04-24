import React from "react";
import { useRoutes } from "./routes";
import Sidebar from "../components/layout/Sidebar";

export default function App() {
  const page = useRoutes();

  return (
    <div className="app">
      <Sidebar />
      <div className="app__content">{page}</div>
    </div>
  );
}