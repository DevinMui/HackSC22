import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/auth';
import Dash from './screens/dash';
import GhRedirect from './screens/ghRedirect';
import Landing from './screens/landing';
import Login from './screens/login';
import Campaign from './screens/campaign';
import Sponsor from './screens/sponsor';

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
          <Route path="/campaigns/:owner/:repo" element={<Campaign />} />
          <Route path="/campaign/:owner/:repo/sponsor" element={<Sponsor />} />
          <Route path="/campaigns/:id" element={<Campaign />} />
          <Route path="/campaigns/:id/sponsors" element={<Sponsor />} />
        </Routes>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!auth.user) nav('/login');
  }, []);

  if (!auth.user) {
    return <></>;
  } else {
    return children;
  }
};

export default App;
