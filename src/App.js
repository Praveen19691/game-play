import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import FormData from "./components/5-cards/form/form.jsx";
import HomePage from "./components/HomePage.jsx";
import SkullKingForm from "./components/skullking/SkullkingForm.jsx";
import GamePage from "./components/skullking/GamePlay.jsx";
import "./app.css";

// Wrapper for HomePage to use navigation
function HomePageWithNav() {
  const navigate = useNavigate();
  return (
    <HomePage
      onSelectGame={(game) =>
        navigate(game === "5cards" ? "/5cards" : "/skullking")
      }
    />
  );
}

function App() {
  return (
    <div className="apps">
      <Router>
        <Routes>
          <Route path="/" element={<HomePageWithNav />} />
          <Route path="/5cards-" element={<FormData />} />
          <Route path="/5cards/player-names" element={<FormData />} />
          <Route path="/skullking" element={<SkullKingForm />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
