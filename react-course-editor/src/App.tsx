import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditCourse from "./components/EditCourse";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EditCourse />} />
      </Routes>
    </Router>
  );
}

export default App;
