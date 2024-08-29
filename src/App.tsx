import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home/Home";
import Layout from "./Layout";
function App() {
  const navigate = useNavigate();
  return <Layout />;
}

export default App;
