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
        <Route path="tv" element={<Tv />} />
        <Route path="tv/:id" element={<Tv />} />
        <Route path="search/*" element={<Search />} />
        <Route path="movie/:id" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
