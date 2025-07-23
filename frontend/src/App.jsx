import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginpage/LoginPage';
import ProtectedRoute from "./shared/ProtectedRoute";
import RegisterPage from './pages/registerpage/RegisterPage';
import ForgotPasswordPage from './pages/forgotpasswordpage/ForgotpasswordPage';
import ResetPasswordPage from './pages/resetpasswordpage/ResetPasswordPage';
import HomePage from './pages/homepage/HomePage';
import StartPage from './pages/startpage/StartPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/tasks" element={<HomePage />} />
          <Route path='/start' element={<StartPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;