import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/auth";
import Dash from "./screens/dash";
import GhRedirect from "./screens/ghRedirect";
import Landing from "./screens/landing";
import Login from "./screens/login";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login_token" element={<GhRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dash"
            element={
              <RequireAuth>
                <Dash />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const nav = useNavigate();

  if (!auth.user) {
    nav("/login");
    return <></>;
  } else {
    return children;
  }
};

export default App;
