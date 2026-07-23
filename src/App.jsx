import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginAdmin from './pages/admin/LoginAdmin';
import Rekapitulasi from './pages/admin/Rekapitulasi';
import AdminRoute from './components/admin/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        
        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/rekapitulasi" element={<Rekapitulasi />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
