import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Classes from '@/pages/Classes';
import Attendance from '@/pages/Attendance';
import Records from '@/pages/Records';
import Students from '@/pages/Students';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/records" element={<Records />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </Layout>
    </Router>
  );
}