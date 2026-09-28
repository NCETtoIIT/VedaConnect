import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sites from './pages/Sites';
import StudyDetail from './pages/StudyDetail';
import Safety from './pages/Safety';
import Alerts from './pages/Alerts';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sites" element={<Sites />} />
          <Route path="study/:id" element={<StudyDetail />} />
          <Route path="safety" element={<Safety />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
