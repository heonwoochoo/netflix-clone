import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}/tv`} element={<Tv />} />
        <Route path={`${process.env.PUBLIC_URL}/tv/:id`} element={<Tv />} />
        <Route
          path={`${process.env.PUBLIC_URL}/search/*`}
          element={<Search />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/movie/:id`}
          element={<Home />}
        />
        <Route path={`${process.env.PUBLIC_URL}/`} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
