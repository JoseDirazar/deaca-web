import "./App.css";
import { Routes, Route } from "react-router";
import LandingPage from "@/pages/Landing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
