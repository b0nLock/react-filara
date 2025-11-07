import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  return (
    <>
      <Routes>
        {isAuthorized && <Route path="/" element={<Home />} />}
        <Route
          path="/login"
          element={<Login setIsAuthorized={setIsAuthorized} />}
        />
        <Route
          path="/register"
          element={<Register setIsAuthorized={setIsAuthorized} />}
        />
        {isAuthorized ? (
          <Route path="*" element={<Navigate to="/" />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
