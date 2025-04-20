import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Import pages
import Dashboard from "@/pages/Dashboard";
import JobsPage from "@/pages/Jobs";
import CandidatesPage from "@/pages/Candidates";
import AppointmentsPage from "@/pages/Appointments";
import VoiceSimulationPage from "@/pages/VoiceSimulation";
import Layout from "@/components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="voice-simulation" element={<VoiceSimulationPage />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
