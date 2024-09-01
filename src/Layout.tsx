import { NextUIProvider } from "@nextui-org/react";
import App from "./App";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home/Home";
import TrainShow from "./Train/TrainShow";

function Layout() {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={"/train/:id/:station"} element={<TrainShow />} />
      </Routes>
    </NextUIProvider>
  );
}

export default Layout;
