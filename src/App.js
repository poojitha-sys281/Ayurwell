import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import DoshaQuiz from "./pages/DoshaQuiz";
import HealthProfile from "./pages/HealthProfile";
import Dashboard from "./pages/Dashboard";
import MedicineChecker from "./pages/MedicineChecker";
import SymptomChecker from "./pages/SymptomChecker";
import WellnessPlan from "./pages/WellnessPlan";
import BookAppointment from "./pages/BookAppointment";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/dosha-quiz" element={<ProtectedRoute><DoshaQuiz /></ProtectedRoute>} />
          <Route path="/health-profile" element={<ProtectedRoute><HealthProfile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/medicine-checker" element={<ProtectedRoute><MedicineChecker /></ProtectedRoute>} />
          <Route path="/symptom-checker" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
          <Route path="/wellness-plan" element={<ProtectedRoute><WellnessPlan /></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
